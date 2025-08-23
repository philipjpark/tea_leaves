// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title BarteringEngine
 * @dev Core contract for facilitating direct asset-to-asset bartering on the tea_leaves platform
 * @author tea_leaves Team
 * @notice This contract enables users to create and execute direct barter offers
 *         between any tokenized assets without requiring traditional order books
 */
contract BarteringEngine is Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    // =============================================================================
    // STRUCTS & ENUMS
    // =============================================================================

    enum BarterStatus {
        Open,           // Offer is open for acceptance
        Completed,      // Offer has been completed
        Cancelled,      // Offer was cancelled by creator
        Expired,        // Offer expired
        Pending         // Offer is being processed
    }

    enum SwapType {
        Direct,         // Direct asset swap
        Conditional,    // Conditional swap with conditions
        TimeLocked,     // Time-locked swap
        Escrow          // Escrow-based swap
    }

    struct BarterOffer {
        uint256 offerId;                    // Unique offer identifier
        address offerMaker;                 // Address creating the offer
        address offerToken;                 // Token being offered
        uint256 offerAmount;                // Amount of tokens being offered
        address requestToken;               // Token being requested
        uint256 requestAmount;              // Amount of tokens being requested
        uint256 expiryTimestamp;            // When the offer expires
        BarterStatus status;                // Current status of the offer
        SwapType swapType;                  // Type of swap
        uint256 creationTimestamp;          // When the offer was created
        uint256 completionTimestamp;        // When the offer was completed
        address acceptor;                   // Who accepted the offer
        string metadata;                    // Additional metadata (IPFS hash)
        bool isVerified;                    // Whether the offer has been verified
        uint256 verificationTimestamp;      // When the offer was verified
        address verifier;                   // Who verified the offer
    }

    struct SwapCondition {
        uint256 offerId;                    // Associated offer ID
        uint256 minRequestAmount;           // Minimum acceptable request amount
        uint256 maxRequestAmount;           // Maximum acceptable request amount
        uint256 slippageTolerance;          // Slippage tolerance in basis points
        bool requireVerification;           // Whether verification is required
        uint256 timeLockDuration;           // Time lock duration in seconds
        address[] allowedAcceptors;         // List of allowed acceptors (empty = anyone)
        bool isActive;                      // Whether the condition is active
    }

    struct BarterTransaction {
        uint256 transactionId;              // Unique transaction identifier
        uint256 offerId;                    // Associated offer ID
        address initiator;                  // Who initiated the transaction
        address counterparty;               // Counterparty in the transaction
        uint256 initiatorTokenAmount;       // Amount from initiator
        address initiatorToken;             // Token from initiator
        uint256 counterpartyTokenAmount;    // Amount from counterparty
        address counterpartyToken;          // Token from counterparty
        uint256 executionTimestamp;         // When the transaction was executed
        bool isSuccessful;                  // Whether the transaction succeeded
        string failureReason;               // Reason for failure if applicable
        uint256 gasUsed;                    // Gas used for the transaction
        uint256 feePaid;                    // Fee paid for the transaction
    }

    // =============================================================================
    // STATE VARIABLES
    // =============================================================================

    Counters.Counter private _offerIds;
    Counters.Counter private _transactionIds;

    mapping(uint256 => BarterOffer) public barterOffers;
    mapping(uint256 => SwapCondition) public swapConditions;
    mapping(uint256 => BarterTransaction) public barterTransactions;
    mapping(address => uint256[]) public userOffers;
    mapping(address => uint256[]) public userTransactions;
    mapping(address => bool) public authorizedVerifiers;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenSwapCount;
    mapping(address => uint256) public userSwapVolume;

    uint256 public platformFee = 0.001 ether;           // Platform fee per swap
    uint256 public verificationFee = 0.0005 ether;      // Fee for offer verification
    uint256 public maxOfferExpiry = 30 days;            // Maximum offer expiry time
    uint256 public minOfferAmount = 0.001 ether;        // Minimum offer amount
    uint256 public maxOfferAmount = 1000 ether;         // Maximum offer amount
    uint256 public defaultSlippageTolerance = 50;       // Default slippage (0.5%)
    uint256 public maxSlippageTolerance = 1000;         // Maximum slippage (10%)

    // =============================================================================
    // EVENTS
    // =============================================================================

    event BarterOfferCreated(
        uint256 indexed offerId,
        address indexed offerMaker,
        address indexed offerToken,
        uint256 offerAmount,
        address requestToken,
        uint256 requestAmount,
        uint256 expiryTimestamp,
        SwapType swapType
    );

    event BarterOfferAccepted(
        uint256 indexed offerId,
        address indexed acceptor,
        uint256 indexed transactionId,
        uint256 executionTimestamp
    );

    event BarterOfferCancelled(
        uint256 indexed offerId,
        address indexed canceller,
        uint256 cancellationTimestamp
    );

    event BarterOfferExpired(
        uint256 indexed offerId,
        uint256 expiryTimestamp
    );

    event BarterOfferVerified(
        uint256 indexed offerId,
        address indexed verifier,
        uint256 verificationTimestamp
    );

    event SwapConditionUpdated(
        uint256 indexed offerId,
        uint256 minRequestAmount,
        uint256 maxRequestAmount,
        uint256 slippageTolerance
    );

    event TransactionExecuted(
        uint256 indexed transactionId,
        uint256 indexed offerId,
        address indexed initiator,
        address counterparty,
        uint256 initiatorAmount,
        uint256 counterpartyAmount
    );

    event FeesUpdated(
        uint256 newPlatformFee,
        uint256 newVerificationFee
    );

    event SupportedTokenUpdated(
        address indexed token,
        bool isSupported
    );

    event AuthorizedVerifierUpdated(
        address indexed verifier,
        bool isAuthorized
    );

    // =============================================================================
    // MODIFIERS
    // =============================================================================

    modifier onlyAuthorizedVerifier() {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Not authorized to verify offers");
        _;
    }

    modifier offerExists(uint256 offerId) {
        require(barterOffers[offerId].offerMaker != address(0), "Offer does not exist");
        _;
    }

    modifier offerOpen(uint256 offerId) {
        require(barterOffers[offerId].status == BarterStatus.Open, "Offer is not open");
        _;
    }

    modifier onlyOfferMaker(uint256 offerId) {
        require(barterOffers[offerId].offerMaker == msg.sender, "Only offer maker can perform this action");
        _;
    }

    modifier notExpired(uint256 offerId) {
        require(barterOffers[offerId].expiryTimestamp > block.timestamp, "Offer has expired");
        _;
    }

    modifier validAmounts(uint256 offerAmount, uint256 requestAmount) {
        require(offerAmount >= minOfferAmount && offerAmount <= maxOfferAmount, "Invalid offer amount");
        require(requestAmount >= minOfferAmount && requestAmount <= maxOfferAmount, "Invalid request amount");
        _;
    }

    modifier validExpiry(uint256 expiryTimestamp) {
        require(expiryTimestamp > block.timestamp, "Expiry must be in the future");
        require(expiryTimestamp <= block.timestamp + maxOfferExpiry, "Expiry too far in the future");
        _;
    }

    // =============================================================================
    // CONSTRUCTOR
    // =============================================================================

    constructor() {
        // Set initial authorized verifiers
        authorizedVerifiers[msg.sender] = true;
    }

    // =============================================================================
    // CORE FUNCTIONS
    // =============================================================================

    /**
     * @dev Create a new barter offer
     * @param offerToken Token being offered
     * @param offerAmount Amount of tokens being offered
     * @param requestToken Token being requested
     * @param requestAmount Amount of tokens being requested
     * @param expiryTimestamp When the offer expires
     * @param swapType Type of swap
     * @param metadata Additional metadata (IPFS hash)
     */
    function createBarterOffer(
        address offerToken,
        uint256 offerAmount,
        address requestToken,
        uint256 requestAmount,
        uint256 expiryTimestamp,
        SwapType swapType,
        string memory metadata
    ) external payable nonReentrant whenNotPaused validAmounts(offerAmount, requestAmount) validExpiry(expiryTimestamp) {
        require(offerToken != requestToken, "Cannot offer same token");
        require(supportedTokens[offerToken] || offerToken == address(0), "Offer token not supported");
        require(supportedTokens[requestToken] || requestToken == address(0), "Request token not supported");
        require(msg.value >= platformFee, "Insufficient platform fee");

        // Transfer offer tokens to this contract
        if (offerToken != address(0)) {
            IERC20(offerToken).safeTransferFrom(msg.sender, address(this), offerAmount);
        }

        _offerIds.increment();
        uint256 offerId = _offerIds.current();

        barterOffers[offerId] = BarterOffer({
            offerId: offerId,
            offerMaker: msg.sender,
            offerToken: offerToken,
            offerAmount: offerAmount,
            requestToken: requestToken,
            requestAmount: requestAmount,
            expiryTimestamp: expiryTimestamp,
            status: BarterStatus.Open,
            swapType: swapType,
            creationTimestamp: block.timestamp,
            completionTimestamp: 0,
            acceptor: address(0),
            metadata: metadata,
            isVerified: false,
            verificationTimestamp: 0,
            verifier: address(0)
        });

        userOffers[msg.sender].push(offerId);
        tokenSwapCount[offerToken]++;
        tokenSwapCount[requestToken]++;

        emit BarterOfferCreated(
            offerId,
            msg.sender,
            offerToken,
            offerAmount,
            requestToken,
            requestAmount,
            expiryTimestamp,
            swapType
        );
    }

    /**
     * @dev Accept a barter offer
     * @param offerId ID of the offer to accept
     */
    function acceptBarterOffer(uint256 offerId) external payable nonReentrant whenNotPaused offerExists(offerId) offerOpen(offerId) notExpired(offerId) {
        BarterOffer storage offer = barterOffers[offerId];
        require(msg.sender != offer.offerMaker, "Cannot accept your own offer");

        // Check if verification is required
        if (swapConditions[offerId].requireVerification && !offer.isVerified) {
            revert("Offer requires verification before acceptance");
        }

        // Transfer request tokens to this contract
        if (offer.requestToken != address(0)) {
            IERC20(offer.requestToken).safeTransferFrom(msg.sender, address(this), offer.requestAmount);
        }

        // Execute the swap
        _executeSwap(offerId, msg.sender);
    }

    /**
     * @dev Cancel a barter offer (only by offer maker)
     * @param offerId ID of the offer to cancel
     */
    function cancelBarterOffer(uint256 offerId) external nonReentrant whenNotPaused offerExists(offerId) onlyOfferMaker(offerId) offerOpen(offerId) {
        BarterOffer storage offer = barterOffers[offerId];
        offer.status = BarterStatus.Cancelled;

        // Return offer tokens to maker
        if (offer.offerToken != address(0)) {
            IERC20(offer.offerToken).safeTransfer(offer.offerMaker, offer.offerAmount);
        }

        emit BarterOfferCancelled(offerId, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify a barter offer (only authorized verifiers)
     * @param offerId ID of the offer to verify
     */
    function verifyBarterOffer(uint256 offerId) external payable nonReentrant whenNotPaused onlyAuthorizedVerifier offerExists(offerId) {
        require(msg.value >= verificationFee, "Insufficient verification fee");

        BarterOffer storage offer = barterOffers[offerId];
        require(!offer.isVerified, "Offer already verified");
        require(offer.status == BarterStatus.Open, "Offer must be open for verification");

        offer.isVerified = true;
        offer.verificationTimestamp = block.timestamp;
        offer.verifier = msg.sender;

        emit BarterOfferVerified(offerId, msg.sender, block.timestamp);
    }

    /**
     * @dev Set swap conditions for an offer
     * @param offerId ID of the offer
     * @param minRequestAmount Minimum acceptable request amount
     * @param maxRequestAmount Maximum acceptable request amount
     * @param slippageTolerance Slippage tolerance in basis points
     * @param requireVerification Whether verification is required
     * @param timeLockDuration Time lock duration in seconds
     * @param allowedAcceptors List of allowed acceptors
     */
    function setSwapConditions(
        uint256 offerId,
        uint256 minRequestAmount,
        uint256 maxRequestAmount,
        uint256 slippageTolerance,
        bool requireVerification,
        uint256 timeLockDuration,
        address[] memory allowedAcceptors
    ) external onlyOfferMaker(offerId) offerExists(offerId) offerOpen(offerId) {
        require(slippageTolerance <= maxSlippageTolerance, "Slippage tolerance too high");
        require(minRequestAmount <= maxRequestAmount, "Invalid amount range");

        swapConditions[offerId] = SwapCondition({
            offerId: offerId,
            minRequestAmount: minRequestAmount,
            maxRequestAmount: maxRequestAmount,
            slippageTolerance: slippageTolerance,
            requireVerification: requireVerification,
            timeLockDuration: timeLockDuration,
            allowedAcceptors: allowedAcceptors,
            isActive: true
        });

        emit SwapConditionUpdated(offerId, minRequestAmount, maxRequestAmount, slippageTolerance);
    }

    /**
     * @dev Execute a direct swap between two parties
     * @param offerId ID of the offer
     * @param acceptor Address accepting the offer
     */
    function _executeSwap(uint256 offerId, address acceptor) internal {
        BarterOffer storage offer = barterOffers[offerId];
        offer.status = BarterStatus.Pending;

        _transactionIds.increment();
        uint256 transactionId = _transactionIds.current();

        // Create transaction record
        barterTransactions[transactionId] = BarterTransaction({
            transactionId: transactionId,
            offerId: offerId,
            initiator: offer.offerMaker,
            counterparty: acceptor,
            initiatorTokenAmount: offer.offerAmount,
            initiatorToken: offer.offerToken,
            counterpartyTokenAmount: offer.requestAmount,
            counterpartyToken: offer.requestToken,
            executionTimestamp: block.timestamp,
            isSuccessful: false,
            failureReason: "",
            gasUsed: 0,
            feePaid: platformFee
        });

        // Execute the actual token transfers
        bool success = _executeTokenTransfers(offerId, transactionId);

        if (success) {
            offer.status = BarterStatus.Completed;
            offer.completionTimestamp = block.timestamp;
            offer.acceptor = acceptor;

            barterTransactions[transactionId].isSuccessful = true;

            // Update statistics
            userSwapVolume[offer.offerMaker] += offer.offerAmount;
            userSwapVolume[acceptor] += offer.requestAmount;

            emit BarterOfferAccepted(offerId, acceptor, transactionId, block.timestamp);
            emit TransactionExecuted(
                transactionId,
                offerId,
                offer.offerMaker,
                acceptor,
                offer.offerAmount,
                offer.requestAmount
            );
        } else {
            offer.status = BarterStatus.Open;
            barterTransactions[transactionId].failureReason = "Token transfer failed";
            barterTransactions[transactionId].isSuccessful = false;
        }
    }

    /**
     * @dev Execute the actual token transfers for a swap
     * @param offerId ID of the offer
     * @param transactionId ID of the transaction
     * @return True if successful, false otherwise
     */
    function _executeTokenTransfers(uint256 offerId, uint256 transactionId) internal returns (bool) {
        BarterOffer storage offer = barterOffers[offerId];
        BarterTransaction storage transaction = barterTransactions[transactionId];

        try this._transferTokens(
            offer.offerToken,
            address(this),
            transaction.counterparty,
            offer.offerAmount
        ) {
            try this._transferTokens(
                offer.requestToken,
                address(this),
                transaction.initiator,
                offer.requestAmount
            ) {
                return true;
            } catch {
                // Revert the first transfer if second fails
                try this._transferTokens(
                    offer.offerToken,
                    transaction.counterparty,
                    address(this),
                    offer.offerAmount
                ) {
                    // Transfer succeeded, but we still return false
                } catch {
                    // Transfer reversion failed - this is a critical error
                }
                return false;
            }
        } catch {
            return false;
        }
    }

    /**
     * @dev Transfer tokens (external function for try-catch)
     * @param token Token to transfer
     * @param from Source address
     * @param to Destination address
     * @param amount Amount to transfer
     */
    function _transferTokens(
        address token,
        address from,
        address to,
        uint256 amount
    ) external {
        require(msg.sender == address(this), "Only self-call allowed");
        
        if (token == address(0)) {
            // Handle ETH transfers
            if (from == address(this)) {
                payable(to).transfer(amount);
            }
        } else {
            // Handle ERC20 transfers
            if (from == address(this)) {
                IERC20(token).safeTransfer(to, amount);
            } else {
                IERC20(token).safeTransferFrom(from, to, amount);
            }
        }
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    /**
     * @dev Get barter offer details
     * @param offerId ID of the offer
     * @return Complete offer details
     */
    function getBarterOffer(uint256 offerId) external view offerExists(offerId) returns (BarterOffer memory) {
        return barterOffers[offerId];
    }

    /**
     * @dev Get swap conditions for an offer
     * @param offerId ID of the offer
     * @return Swap conditions
     */
    function getSwapConditions(uint256 offerId) external view returns (SwapCondition memory) {
        return swapConditions[offerId];
    }

    /**
     * @dev Get transaction details
     * @param transactionId ID of the transaction
     * @return Transaction details
     */
    function getTransaction(uint256 transactionId) external view returns (BarterTransaction memory) {
        return barterTransactions[transactionId];
    }

    /**
     * @dev Get all offers by a user
     * @param user Address of the user
     * @return Array of offer IDs
     */
    function getUserOffers(address user) external view returns (uint256[] memory) {
        return userOffers[user];
    }

    /**
     * @dev Get all transactions by a user
     * @param user Address of the user
     * @return Array of transaction IDs
     */
    function getUserTransactions(address user) external view returns (uint256[] memory) {
        return userTransactions[user];
    }

    /**
     * @dev Get total number of offers created
     * @return Total offer count
     */
    function getTotalOfferCount() external view returns (uint256) {
        return _offerIds.current();
    }

    /**
     * @dev Get total number of transactions executed
     * @return Total transaction count
     */
    function getTotalTransactionCount() external view returns (uint256) {
        return _transactionIds.current();
    }

    /**
     * @dev Check if an offer has expired
     * @param offerId ID of the offer
     * @return True if expired, false otherwise
     */
    function isOfferExpired(uint256 offerId) external view offerExists(offerId) returns (bool) {
        return barterOffers[offerId].expiryTimestamp <= block.timestamp;
    }

    /**
     * @dev Get user swap volume
     * @param user Address of the user
     * @return Total swap volume
     */
    function getUserSwapVolume(address user) external view returns (uint256) {
        return userSwapVolume[user];
    }

    /**
     * @dev Get token swap count
     * @param token Address of the token
     * @return Number of swaps involving this token
     */
    function getTokenSwapCount(address token) external view returns (uint256) {
        return tokenSwapCount[token];
    }

    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================

    /**
     * @dev Update platform and verification fees
     * @param newPlatformFee New platform fee
     * @param newVerificationFee New verification fee
     */
    function updateFees(uint256 newPlatformFee, uint256 newVerificationFee) external onlyOwner {
        platformFee = newPlatformFee;
        verificationFee = newVerificationFee;

        emit FeesUpdated(newPlatformFee, newVerificationFee);
    }

    /**
     * @dev Update offer limits
     * @param newMinAmount New minimum amount
     * @param newMaxAmount New maximum amount
     */
    function updateOfferLimits(uint256 newMinAmount, uint256 newMaxAmount) external onlyOwner {
        require(newMinAmount < newMaxAmount, "Min amount must be less than max amount");
        minOfferAmount = newMinAmount;
        maxOfferAmount = newMaxAmount;
    }

    /**
     * @dev Update offer expiry limits
     * @param newMaxExpiry New maximum expiry time
     */
    function updateMaxOfferExpiry(uint256 newMaxExpiry) external onlyOwner {
        require(newMaxExpiry <= 90 days, "Max expiry cannot exceed 90 days");
        maxOfferExpiry = newMaxExpiry;
    }

    /**
     * @dev Update slippage tolerance limits
     * @param newMaxSlippage New maximum slippage tolerance
     */
    function updateMaxSlippageTolerance(uint256 newMaxSlippage) external onlyOwner {
        require(newMaxSlippage <= 2000, "Max slippage cannot exceed 20%");
        maxSlippageTolerance = newMaxSlippage;
    }

    /**
     * @dev Add or remove supported token
     * @param token Address of the token
     * @param isSupported Whether to support the token
     */
    function setSupportedToken(address token, bool isSupported) external onlyOwner {
        supportedTokens[token] = isSupported;
        emit SupportedTokenUpdated(token, isSupported);
    }

    /**
     * @dev Authorize or deauthorize a verifier
     * @param verifier Address to authorize/deauthorize
     * @param isAuthorized Whether to authorize
     */
    function setAuthorizedVerifier(address verifier, bool isAuthorized) external onlyOwner {
        authorizedVerifiers[verifier] = isAuthorized;
        emit AuthorizedVerifierUpdated(verifier, isAuthorized);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Withdraw accumulated fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");

        payable(owner()).transfer(balance);
    }

    // =============================================================================
    // EMERGENCY FUNCTIONS
    // =============================================================================

    /**
     * @dev Emergency function to cancel an offer (owner only)
     * @param offerId ID of the offer
     */
    function emergencyCancelOffer(uint256 offerId) external onlyOwner offerExists(offerId) {
        BarterOffer storage offer = barterOffers[offerId];
        require(offer.status == BarterStatus.Open, "Offer is not open");

        offer.status = BarterStatus.Cancelled;

        // Return offer tokens to maker
        if (offer.offerToken != address(0)) {
            IERC20(offer.offerToken).safeTransfer(offer.offerMaker, offer.offerAmount);
        }

        emit BarterOfferCancelled(offerId, owner(), block.timestamp);
    }

    /**
     * @dev Emergency function to revoke verification (owner only)
     * @param offerId ID of the offer
     */
    function emergencyRevokeVerification(uint256 offerId) external onlyOwner offerExists(offerId) {
        BarterOffer storage offer = barterOffers[offerId];
        require(offer.isVerified, "Offer is not verified");

        offer.isVerified = false;
        offer.verificationTimestamp = 0;
        offer.verifier = address(0);
    }

    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================

    /**
     * @dev Check if an offer can be accepted by a specific address
     * @param offerId ID of the offer
     * @param acceptor Address trying to accept
     * @return True if can accept, false otherwise
     */
    function canAcceptOffer(uint256 offerId, address acceptor) external view returns (bool) {
        BarterOffer storage offer = barterOffers[offerId];
        if (offer.status != BarterStatus.Open) return false;
        if (offer.expiryTimestamp <= block.timestamp) return false;
        if (acceptor == offer.offerMaker) return false;

        SwapCondition storage condition = swapConditions[offerId];
        if (condition.isActive && condition.allowedAcceptors.length > 0) {
            bool isAllowed = false;
            for (uint256 i = 0; i < condition.allowedAcceptors.length; i++) {
                if (condition.allowedAcceptors[i] == acceptor) {
                    isAllowed = true;
                    break;
                }
            }
            if (!isAllowed) return false;
        }

        if (condition.requireVerification && !offer.isVerified) return false;

        return true;
    }

    /**
     * @dev Get offer statistics
     * @return Total offers, open offers, completed offers, cancelled offers
     */
    function getOfferStatistics() external view returns (uint256, uint256, uint256, uint256) {
        uint256 total = _offerIds.current();
        uint256 open = 0;
        uint256 completed = 0;
        uint256 cancelled = 0;

        for (uint256 i = 1; i <= total; i++) {
            BarterStatus status = barterOffers[i].status;
            if (status == BarterStatus.Open) open++;
            else if (status == BarterStatus.Completed) completed++;
            else if (status == BarterStatus.Cancelled) cancelled++;
        }

        return (total, open, completed, cancelled);
    }

    // =============================================================================
    // RECEIVE FUNCTION
    // =============================================================================

    /**
     * @dev Allow the contract to receive ETH
     */
    receive() external payable {
        // Contract can receive ETH for fees and deposits
    }
} 