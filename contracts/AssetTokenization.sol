// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AssetTokenization
 * @dev Core contract for creating and managing tokenized assets on the tea_leaves platform
 * @author tea_leaves Team
 * @notice This contract enables users to tokenize real-world assets and create
 *         tradeable digital representations on the BNB Chain
 */
contract AssetTokenization is ERC20, ERC20Burnable, Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // =============================================================================
    // STRUCTS & ENUMS
    // =============================================================================

    enum AssetClass {
        IPRights,           // Intellectual Property Rights
        MusicRoyalties,     // Music Royalties & Licensing
        RealEstate,         // Real Estate & Property
        Commodities,        // Commodities & Raw Materials
        PredictionMarkets,  // Prediction Markets & Forecasting
        StartupEquity,      // Startup Equity & Venture Capital
        CryptoTokens,       // Cryptocurrency & Digital Assets
        TokenizedSecurities, // Traditional Securities
        Custom              // Custom Asset Types
    }

    enum TokenStatus {
        Active,             // Token is active and tradeable
        Paused,             // Token is temporarily paused
        Suspended,          // Token is suspended due to compliance issues
        Redeemed,           // Token has been redeemed for underlying asset
        Expired             // Token has expired
    }

    struct AssetMetadata {
        string assetName;           // Human-readable asset name
        string assetSymbol;         // Asset symbol (3-7 characters)
        AssetClass assetClass;      // Classification of the asset
        string description;         // Detailed description
        string metadataURI;         // IPFS or HTTP URI for additional metadata
        uint256 totalSupply;        // Total supply of tokens
        uint256 circulatingSupply;  // Currently circulating supply
        uint256 decimals;           // Token decimal places
        uint256 creationDate;       // Timestamp of token creation
        uint256 expiryDate;         // Optional expiry date (0 = no expiry)
        address creator;            // Address that created the token
        TokenStatus status;         // Current status of the token
        bool isVerified;            // Whether the token has been verified
        uint256 verificationDate;   // Date of verification
        address verifier;           // Address that verified the token
    }

    struct TokenizationRequest {
        uint256 requestId;          // Unique request identifier
        string assetName;           // Requested asset name
        string assetSymbol;         // Requested asset symbol
        AssetClass assetClass;      // Requested asset class
        string description;         // Asset description
        uint256 requestedSupply;    // Requested total supply
        uint256 requestedDecimals;  // Requested decimal places
        uint256 creationFee;        // Fee paid for token creation
        address requester;          // Address making the request
        uint256 requestDate;        // Date of request
        bool isApproved;            // Whether request is approved
        bool isProcessed;           // Whether request has been processed
        string rejectionReason;     // Reason for rejection if applicable
    }

    // =============================================================================
    // STATE VARIABLES
    // =============================================================================

    Counters.Counter private _tokenIds;
    Counters.Counter private _requestIds;

    mapping(uint256 => AssetMetadata) public assetTokens;
    mapping(uint256 => TokenizationRequest) public tokenizationRequests;
    mapping(address => uint256[]) public userTokens;
    mapping(address => uint256[]) public userRequests;
    mapping(string => bool) public usedSymbols;
    mapping(address => bool) public authorizedCreators;
    mapping(address => bool) public authorizedVerifiers;

    uint256 public creationFee = 0.01 ether;           // Fee for creating tokens
    uint256 public verificationFee = 0.005 ether;      // Fee for verifying tokens
    uint256 public maxTokenSupply = 1_000_000_000;     // Maximum total supply per token
    uint256 public minTokenSupply = 1_000;             // Minimum total supply per token
    uint256 public maxSymbolLength = 7;                // Maximum symbol length
    uint256 public minSymbolLength = 3;                // Minimum symbol length

    // =============================================================================
    // EVENTS
    // =============================================================================

    event AssetTokenized(
        uint256 indexed tokenId,
        string assetName,
        string assetSymbol,
        AssetClass indexed assetClass,
        address indexed creator,
        uint256 totalSupply,
        uint256 creationDate
    );

    event TokenizationRequested(
        uint256 indexed requestId,
        string assetName,
        string assetSymbol,
        AssetClass indexed assetClass,
        address indexed requester,
        uint256 requestDate
    );

    event RequestApproved(
        uint256 indexed requestId,
        address indexed approver,
        uint256 approvalDate
    );

    event RequestRejected(
        uint256 indexed requestId,
        address indexed rejector,
        string reason,
        uint256 rejectionDate
    );

    event TokenStatusChanged(
        uint256 indexed tokenId,
        TokenStatus oldStatus,
        TokenStatus newStatus,
        address indexed changer
    );

    event TokenVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        uint256 verificationDate
    );

    event FeesUpdated(
        uint256 newCreationFee,
        uint256 newVerificationFee
    );

    event AuthorizedUserUpdated(
        address indexed user,
        bool isAuthorized,
        string role
    );

    // =============================================================================
    // MODIFIERS
    // =============================================================================

    modifier onlyAuthorizedCreator() {
        require(authorizedCreators[msg.sender] || msg.sender == owner(), "Not authorized to create tokens");
        _;
    }

    modifier onlyAuthorizedVerifier() {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Not authorized to verify tokens");
        _;
    }

    modifier tokenExists(uint256 tokenId) {
        require(assetTokens[tokenId].creator != address(0), "Token does not exist");
        _;
    }

    modifier requestExists(uint256 requestId) {
        require(tokenizationRequests[requestId].requester != address(0), "Request does not exist");
        _;
    }

    modifier onlyTokenCreator(uint256 tokenId) {
        require(assetTokens[tokenId].creator == msg.sender, "Only token creator can perform this action");
        _;
    }

    // =============================================================================
    // CONSTRUCTOR
    // =============================================================================

    constructor() ERC20("tea_leaves Asset Tokenization", "TEA-AT") {
        // Set initial authorized creators and verifiers
        authorizedCreators[msg.sender] = true;
        authorizedVerifiers[msg.sender] = true;
    }

    // =============================================================================
    // CORE FUNCTIONS
    // =============================================================================

    /**
     * @dev Request to create a new tokenized asset
     * @param assetName Name of the asset
     * @param assetSymbol Symbol for the asset (3-7 characters)
     * @param assetClass Classification of the asset
     * @param description Detailed description of the asset
     * @param requestedSupply Total supply requested
     * @param requestedDecimals Decimal places requested
     */
    function requestTokenization(
        string memory assetName,
        string memory assetSymbol,
        AssetClass assetClass,
        string memory description,
        uint256 requestedSupply,
        uint256 requestedDecimals
    ) external payable nonReentrant whenNotPaused {
        require(msg.value >= creationFee, "Insufficient creation fee");
        require(bytes(assetName).length > 0, "Asset name cannot be empty");
        require(bytes(assetSymbol).length >= minSymbolLength && bytes(assetSymbol).length <= maxSymbolLength, "Invalid symbol length");
        require(!usedSymbols[assetSymbol], "Symbol already in use");
        require(requestedSupply >= minTokenSupply && requestedSupply <= maxTokenSupply, "Invalid supply amount");
        require(requestedDecimals <= 18, "Decimals cannot exceed 18");

        _requestIds.increment();
        uint256 requestId = _requestIds.current();

        tokenizationRequests[requestId] = TokenizationRequest({
            requestId: requestId,
            assetName: assetName,
            assetSymbol: assetSymbol,
            assetClass: assetClass,
            description: description,
            requestedSupply: requestedSupply,
            requestedDecimals: requestedDecimals,
            creationFee: msg.value,
            requester: msg.sender,
            requestDate: block.timestamp,
            isApproved: false,
            isProcessed: false,
            rejectionReason: ""
        });

        userRequests[msg.sender].push(requestId);
        usedSymbols[assetSymbol] = true;

        emit TokenizationRequested(
            requestId,
            assetName,
            assetSymbol,
            assetClass,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Approve a tokenization request and create the token
     * @param requestId ID of the request to approve
     */
    function approveTokenizationRequest(uint256 requestId) external onlyAuthorizedCreator requestExists(requestId) {
        TokenizationRequest storage request = tokenizationRequests[requestId];
        require(!request.isProcessed, "Request already processed");
        require(!request.isApproved, "Request already approved");

        request.isApproved = true;
        request.isProcessed = true;

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        // Create the token
        assetTokens[tokenId] = AssetMetadata({
            assetName: request.assetName,
            assetSymbol: request.assetSymbol,
            assetClass: request.assetClass,
            description: request.description,
            metadataURI: "",
            totalSupply: request.requestedSupply,
            circulatingSupply: 0,
            decimals: request.requestedDecimals,
            creationDate: block.timestamp,
            expiryDate: 0, // No expiry by default
            creator: request.requester,
            status: TokenStatus.Active,
            isVerified: false,
            verificationDate: 0,
            verifier: address(0)
        });

        userTokens[request.requester].push(tokenId);

        emit RequestApproved(requestId, msg.sender, block.timestamp);
        emit AssetTokenized(
            tokenId,
            request.assetName,
            request.assetSymbol,
            request.assetClass,
            request.requester,
            request.requestedSupply,
            block.timestamp
        );
    }

    /**
     * @dev Reject a tokenization request
     * @param requestId ID of the request to reject
     * @param reason Reason for rejection
     */
    function rejectTokenizationRequest(uint256 requestId, string memory reason) external onlyAuthorizedCreator requestExists(requestId) {
        TokenizationRequest storage request = tokenizationRequests[requestId];
        require(!request.isProcessed, "Request already processed");

        request.isProcessed = true;
        request.rejectionReason = reason;

        // Refund the creation fee
        payable(request.requester).transfer(request.creationFee);

        // Free up the symbol
        usedSymbols[request.assetSymbol] = false;

        emit RequestRejected(requestId, msg.sender, reason, block.timestamp);
    }

    /**
     * @dev Mint tokens for an approved asset
     * @param tokenId ID of the token to mint
     * @param amount Amount to mint
     * @param to Address to mint tokens to
     */
    function mintAssetTokens(
        uint256 tokenId,
        uint256 amount,
        address to
    ) external onlyTokenCreator(tokenId) tokenExists(tokenId) whenNotPaused {
        AssetMetadata storage token = assetTokens[tokenId];
        require(token.status == TokenStatus.Active, "Token is not active");
        require(token.circulatingSupply + amount <= token.totalSupply, "Exceeds total supply");

        token.circulatingSupply += amount;
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens for an asset
     * @param tokenId ID of the token to burn from
     * @param amount Amount to burn
     */
    function burnAssetTokens(uint256 tokenId, uint256 amount) external tokenExists(tokenId) whenNotPaused {
        AssetMetadata storage token = assetTokens[tokenId];
        require(token.status == TokenStatus.Active, "Token is not active");

        token.circulatingSupply -= amount;
        _burn(msg.sender, amount);
    }

    /**
     * @dev Update token metadata (only creator can update)
     * @param tokenId ID of the token to update
     * @param newDescription New description
     * @param newMetadataURI New metadata URI
     */
    function updateTokenMetadata(
        uint256 tokenId,
        string memory newDescription,
        string memory newMetadataURI
    ) external onlyTokenCreator(tokenId) tokenExists(tokenId) {
        AssetMetadata storage token = assetTokens[tokenId];
        require(token.status == TokenStatus.Active, "Token is not active");

        token.description = newDescription;
        if (bytes(newMetadataURI).length > 0) {
            token.metadataURI = newMetadataURI;
        }
    }

    /**
     * @dev Set token expiry date
     * @param tokenId ID of the token
     * @param expiryDate New expiry date (0 = no expiry)
     */
    function setTokenExpiry(uint256 tokenId, uint256 expiryDate) external onlyTokenCreator(tokenId) tokenExists(tokenId) {
        AssetMetadata storage token = assetTokens[tokenId];
        require(expiryDate == 0 || expiryDate > block.timestamp, "Expiry date must be in the future");

        token.expiryDate = expiryDate;
    }

    /**
     * @dev Change token status
     * @param tokenId ID of the token
     * @param newStatus New status
     */
    function changeTokenStatus(uint256 tokenId, TokenStatus newStatus) external onlyTokenCreator(tokenId) tokenExists(tokenId) {
        AssetMetadata storage token = assetTokens[tokenId];
        require(newStatus != TokenStatus.Verified, "Cannot set verified status directly");

        TokenStatus oldStatus = token.status;
        token.status = newStatus;

        emit TokenStatusChanged(tokenId, oldStatus, newStatus, msg.sender);
    }

    /**
     * @dev Verify a token (only authorized verifiers)
     * @param tokenId ID of the token to verify
     */
    function verifyToken(uint256 tokenId) external payable onlyAuthorizedVerifier tokenExists(tokenId) {
        require(msg.value >= verificationFee, "Insufficient verification fee");

        AssetMetadata storage token = assetTokens[tokenId];
        require(!token.isVerified, "Token already verified");
        require(token.status == TokenStatus.Active, "Token must be active for verification");

        token.isVerified = true;
        token.verificationDate = block.timestamp;
        token.verifier = msg.sender;

        emit TokenVerified(tokenId, msg.sender, block.timestamp);
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    /**
     * @dev Get token metadata
     * @param tokenId ID of the token
     * @return Complete token metadata
     */
    function getTokenMetadata(uint256 tokenId) external view tokenExists(tokenId) returns (AssetMetadata memory) {
        return assetTokens[tokenId];
    }

    /**
     * @dev Get all tokens created by a user
     * @param user Address of the user
     * @return Array of token IDs
     */
    function getUserTokens(address user) external view returns (uint256[] memory) {
        return userTokens[user];
    }

    /**
     * @dev Get all requests made by a user
     * @param user Address of the user
     * @return Array of request IDs
     */
    function getUserRequests(address user) external view returns (uint256[] memory) {
        return userRequests[user];
    }

    /**
     * @dev Get tokenization request details
     * @param requestId ID of the request
     * @return Complete request details
     */
    function getTokenizationRequest(uint256 requestId) external view requestExists(requestId) returns (TokenizationRequest memory) {
        return tokenizationRequests[requestId];
    }

    /**
     * @dev Get total number of tokens created
     * @return Total token count
     */
    function getTotalTokenCount() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Get total number of requests made
     * @return Total request count
     */
    function getTotalRequestCount() external view returns (uint256) {
        return _requestIds.current();
    }

    /**
     * @dev Check if a symbol is available
     * @param symbol Symbol to check
     * @return True if available, false if taken
     */
    function isSymbolAvailable(string memory symbol) external view returns (bool) {
        return !usedSymbols[symbol];
    }

    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================

    /**
     * @dev Update creation and verification fees
     * @param newCreationFee New creation fee
     * @param newVerificationFee New verification fee
     */
    function updateFees(uint256 newCreationFee, uint256 newVerificationFee) external onlyOwner {
        creationFee = newCreationFee;
        verificationFee = newVerificationFee;

        emit FeesUpdated(newCreationFee, newVerificationFee);
    }

    /**
     * @dev Update token supply limits
     * @param newMinSupply New minimum supply
     * @param newMaxSupply New maximum supply
     */
    function updateSupplyLimits(uint256 newMinSupply, uint256 newMaxSupply) external onlyOwner {
        require(newMinSupply < newMaxSupply, "Min supply must be less than max supply");
        minTokenSupply = newMinSupply;
        maxTokenSupply = newMaxSupply;
    }

    /**
     * @dev Update symbol length limits
     * @param newMinLength New minimum length
     * @param newMaxLength New maximum length
     */
    function updateSymbolLimits(uint256 newMinLength, uint256 newMaxLength) external onlyOwner {
        require(newMinLength < newMaxLength, "Min length must be less than max length");
        require(newMaxLength <= 10, "Max length cannot exceed 10");
        minSymbolLength = newMinLength;
        maxSymbolLength = newMaxLength;
    }

    /**
     * @dev Authorize or deauthorize a creator
     * @param creator Address to authorize/deauthorize
     * @param isAuthorized Whether to authorize
     */
    function setAuthorizedCreator(address creator, bool isAuthorized) external onlyOwner {
        authorizedCreators[creator] = isAuthorized;
        emit AuthorizedUserUpdated(creator, isAuthorized, "Creator");
    }

    /**
     * @dev Authorize or deauthorize a verifier
     * @param verifier Address to authorize/deauthorize
     * @param isAuthorized Whether to authorize
     */
    function setAuthorizedVerifier(address verifier, bool isAuthorized) external onlyOwner {
        authorizedVerifiers[verifier] = isAuthorized;
        emit AuthorizedUserUpdated(verifier, isAuthorized, "Verifier");
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
     * @dev Emergency function to change token status (owner only)
     * @param tokenId ID of the token
     * @param newStatus New status
     */
    function emergencyChangeTokenStatus(uint256 tokenId, TokenStatus newStatus) external onlyOwner tokenExists(tokenId) {
        AssetMetadata storage token = assetTokens[tokenId];
        TokenStatus oldStatus = token.status;
        token.status = newStatus;

        emit TokenStatusChanged(tokenId, oldStatus, newStatus, msg.sender);
    }

    /**
     * @dev Emergency function to revoke verification (owner only)
     * @param tokenId ID of the token
     */
    function emergencyRevokeVerification(uint256 tokenId) external onlyOwner tokenExists(tokenId) {
        AssetMetadata storage token = assetTokens[tokenId];
        require(token.isVerified, "Token is not verified");

        token.isVerified = false;
        token.verificationDate = 0;
        token.verifier = address(0);
    }

    // =============================================================================
    // OVERRIDE FUNCTIONS
    // =============================================================================

    /**
     * @dev Override decimals to use token-specific decimals
     */
    function decimals() public view virtual override returns (uint8) {
        // Return default decimals (18) for the main contract
        // Individual tokens will have their own decimal handling
        return 18;
    }

    /**
     * @dev Override transfer to check token status
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        
        // Additional checks can be added here if needed
        // For now, we'll keep it simple
    }
} 