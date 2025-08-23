// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title LiquidityPool
 * @dev Core contract for managing liquidity pools and token swaps on the tea_leaves platform
 * @author tea_leaves Team
 * @notice This contract enables users to provide liquidity and execute token swaps
 *         with automated market making (AMM) functionality
 */
contract LiquidityPool is Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    using Math for uint256;

    // =============================================================================
    // STRUCTS & ENUMS
    // =============================================================================

    enum PoolStatus {
        Active,         // Pool is active and accepting liquidity
        Paused,         // Pool is temporarily paused
        Suspended,      // Pool is suspended due to issues
        Deprecated      // Pool is deprecated and no longer used
    }

    enum SwapType {
        ExactInput,     // Swap exact input amount for minimum output
        ExactOutput     // Swap maximum input for exact output amount
    }

    struct Pool {
        uint256 poolId;                     // Unique pool identifier
        string poolName;                    // Human-readable pool name
        address tokenA;                     // First token in the pool
        address tokenB;                     // Second token in the pool
        uint256 reserveA;                   // Reserve of token A
        uint256 reserveB;                   // Reserve of token B
        uint256 totalSupply;                // Total LP token supply
        uint256 feeRate;                    // Swap fee rate in basis points
        uint256 creationTimestamp;          // When the pool was created
        PoolStatus status;                  // Current pool status
        bool isVerified;                    // Whether the pool has been verified
        uint256 verificationTimestamp;      // When the pool was verified
        address verifier;                   // Who verified the pool
        uint256 swapCount;                  // Total number of swaps
        uint256 volume24h;                  // 24-hour trading volume
        uint256 lastSwapTimestamp;          // Timestamp of last swap
    }

    struct LiquidityPosition {
        uint256 positionId;                 // Unique position identifier
        uint256 poolId;                     // Associated pool ID
        address provider;                    // Liquidity provider
        uint256 liquidityTokens;            // LP tokens owned by this position
        uint256 tokenAAmount;               // Amount of token A provided
        uint256 tokenBAmount;               // Amount of token B provided
        uint256 timestamp;                  // When position was created
        bool isActive;                      // Whether position is active
        uint256 lastClaimTimestamp;         // Last time fees were claimed
        uint256 accumulatedFees;            // Accumulated fees in LP tokens
    }

    struct SwapRequest {
        uint256 requestId;                  // Unique request identifier
        uint256 poolId;                     // Pool to swap in
        SwapType swapType;                  // Type of swap
        address tokenIn;                    // Input token
        address tokenOut;                   // Output token
        uint256 amountIn;                   // Input amount
        uint256 amountOut;                  // Output amount
        uint256 minAmountOut;               // Minimum output amount (for exact input)
        uint256 maxAmountIn;                // Maximum input amount (for exact output)
        address swapper;                    // Address making the swap
        uint256 timestamp;                  // When request was made
        bool isExecuted;                    // Whether swap was executed
        uint256 executionTimestamp;         // When swap was executed
        uint256 feePaid;                    // Fee paid for the swap
        uint256 slippage;                   // Actual slippage experienced
    }

    // =============================================================================
    // STATE VARIABLES
    // =============================================================================

    Counters.Counter private _poolIds;
    Counters.Counter private _positionIds;
    Counters.Counter private _requestIds;

    mapping(uint256 => Pool) public pools;
    mapping(uint256 => LiquidityPosition) public liquidityPositions;
    mapping(uint256 => SwapRequest) public swapRequests;
    mapping(address => uint256[]) public userPositions;
    mapping(address => uint256[]) public userSwaps;
    mapping(address => bool) public authorizedVerifiers;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenPoolCount;
    mapping(address => uint256) public userLiquidityVolume;

    uint256 public platformFee = 0.0005 ether;          // Platform fee per swap
    uint256 public verificationFee = 0.0002 ether;      // Fee for pool verification
    uint256 public maxPoolFee = 1000;                   // Maximum pool fee (10%)
    uint256 public minPoolFee = 10;                     // Minimum pool fee (0.1%)
    uint256 public defaultPoolFee = 30;                 // Default pool fee (0.3%)
    uint256 public maxSlippageTolerance = 1000;         // Maximum slippage (10%)
    uint256 public minLiquidityAmount = 0.001 ether;    // Minimum liquidity amount
    uint256 public maxLiquidityAmount = 10000 ether;    // Maximum liquidity amount

    // =============================================================================
    // EVENTS
    // =============================================================================

    event PoolCreated(
        uint256 indexed poolId,
        string poolName,
        address indexed tokenA,
        address indexed tokenB,
        uint256 initialReserveA,
        uint256 initialReserveB,
        uint256 feeRate
    );

    event LiquidityAdded(
        uint256 indexed positionId,
        uint256 indexed poolId,
        address indexed provider,
        uint256 tokenAAmount,
        uint256 tokenBAmount,
        uint256 liquidityTokens
    );

    event LiquidityRemoved(
        uint256 indexed positionId,
        uint256 indexed poolId,
        address indexed provider,
        uint256 tokenAAmount,
        uint256 tokenBAmount,
        uint256 liquidityTokens
    );

    event SwapExecuted(
        uint256 indexed requestId,
        uint256 indexed poolId,
        address indexed swapper,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 feePaid
    );

    event PoolVerified(
        uint256 indexed poolId,
        address indexed verifier,
        uint256 verificationTimestamp
    );

    event PoolStatusChanged(
        uint256 indexed poolId,
        PoolStatus oldStatus,
        PoolStatus newStatus
    );

    event FeesUpdated(
        uint256 newPlatformFee,
        uint256 newVerificationFee
    );

    event PoolFeeUpdated(
        uint256 indexed poolId,
        uint256 oldFee,
        uint256 newFee
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
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Not authorized to verify pools");
        _;
    }

    modifier poolExists(uint256 poolId) {
        require(pools[poolId].tokenA != address(0), "Pool does not exist");
        _;
    }

    modifier poolActive(uint256 poolId) {
        require(pools[poolId].status == PoolStatus.Active, "Pool is not active");
        _;
    }

    modifier positionExists(uint256 positionId) {
        require(liquidityPositions[positionId].provider != address(0), "Position does not exist");
        _;
    }

    modifier onlyPositionOwner(uint256 positionId) {
        require(liquidityPositions[positionId].provider == msg.sender, "Only position owner can perform this action");
        _;
    }

    modifier validAmounts(uint256 amountA, uint256 amountB) {
        require(amountA >= minLiquidityAmount && amountA <= maxLiquidityAmount, "Invalid amount A");
        require(amountB >= minLiquidityAmount && amountB <= maxLiquidityAmount, "Invalid amount B");
        _;
    }

    modifier validFeeRate(uint256 feeRate) {
        require(feeRate >= minPoolFee && feeRate <= maxPoolFee, "Invalid fee rate");
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
     * @dev Create a new liquidity pool
     * @param poolName Name of the pool
     * @param tokenA First token in the pool
     * @param tokenB Second token in the pool
     * @param initialAmountA Initial amount of token A
     * @param initialAmountB Initial amount of token B
     * @param feeRate Swap fee rate in basis points
     */
    function createPool(
        string memory poolName,
        address tokenA,
        address tokenB,
        uint256 initialAmountA,
        uint256 initialAmountB,
        uint256 feeRate
    ) external payable nonReentrant whenNotPaused validAmounts(initialAmountA, initialAmountB) validFeeRate(feeRate) {
        require(tokenA != tokenB, "Tokens must be different");
        require(supportedTokens[tokenA] || tokenA == address(0), "Token A not supported");
        require(supportedTokens[tokenB] || tokenB == address(0), "Token B not supported");
        require(msg.value >= platformFee, "Insufficient platform fee");

        // Transfer initial tokens to this contract
        if (tokenA != address(0)) {
            IERC20(tokenA).safeTransferFrom(msg.sender, address(this), initialAmountA);
        }
        if (tokenB != address(0)) {
            IERC20(tokenB).safeTransferFrom(msg.sender, address(this), initialAmountB);
        }

        _poolIds.increment();
        uint256 poolId = _poolIds.current();

        // Calculate initial liquidity tokens (geometric mean)
        uint256 initialLiquidity = Math.sqrt(initialAmountA * initialAmountB);

        pools[poolId] = Pool({
            poolId: poolId,
            poolName: poolName,
            tokenA: tokenA,
            tokenB: tokenB,
            reserveA: initialAmountA,
            reserveB: initialAmountB,
            totalSupply: initialLiquidity,
            feeRate: feeRate,
            creationTimestamp: block.timestamp,
            status: PoolStatus.Active,
            isVerified: false,
            verificationTimestamp: 0,
            verifier: address(0),
            swapCount: 0,
            volume24h: 0,
            lastSwapTimestamp: 0
        });

        // Create initial liquidity position
        _createLiquidityPosition(poolId, msg.sender, initialAmountA, initialAmountB, initialLiquidity);

        tokenPoolCount[tokenA]++;
        tokenPoolCount[tokenB]++;

        emit PoolCreated(
            poolId,
            poolName,
            tokenA,
            tokenB,
            initialAmountA,
            initialAmountB,
            feeRate
        );
    }

    /**
     * @dev Add liquidity to an existing pool
     * @param poolId ID of the pool
     * @param amountA Amount of token A to add
     * @param amountB Amount of token B to add
     * @param minLiquidityTokens Minimum LP tokens to receive
     */
    function addLiquidity(
        uint256 poolId,
        uint256 amountA,
        uint256 amountB,
        uint256 minLiquidityTokens
    ) external payable nonReentrant whenNotPaused poolExists(poolId) poolActive(poolId) validAmounts(amountA, amountB) {
        Pool storage pool = pools[poolId];
        
        // Calculate optimal amounts based on current reserves
        (uint256 optimalAmountA, uint256 optimalAmountB) = _calculateOptimalAmounts(
            pool.reserveA,
            pool.reserveB,
            amountA,
            amountB
        );

        // Transfer tokens to this contract
        if (pool.tokenA != address(0)) {
            IERC20(pool.tokenA).safeTransferFrom(msg.sender, address(this), optimalAmountA);
        }
        if (pool.tokenB != address(0)) {
            IERC20(pool.tokenB).safeTransferFrom(msg.sender, address(this), optimalAmountB);
        }

        // Calculate liquidity tokens to mint
        uint256 liquidityTokens = _calculateLiquidityTokens(
            pool.reserveA,
            pool.reserveB,
            optimalAmountA,
            optimalAmountB
        );

        require(liquidityTokens >= minLiquidityTokens, "Insufficient liquidity tokens");

        // Update pool reserves
        pool.reserveA += optimalAmountA;
        pool.reserveB += optimalAmountB;
        pool.totalSupply += liquidityTokens;

        // Create liquidity position
        _createLiquidityPosition(poolId, msg.sender, optimalAmountA, optimalAmountB, liquidityTokens);

        // Refund excess tokens
        if (amountA > optimalAmountA && pool.tokenA != address(0)) {
            IERC20(pool.tokenA).safeTransfer(msg.sender, amountA - optimalAmountA);
        }
        if (amountB > optimalAmountB && pool.tokenB != address(0)) {
            IERC20(pool.tokenB).safeTransfer(msg.sender, amountB - optimalAmountB);
        }
    }

    /**
     * @dev Remove liquidity from a pool
     * @param positionId ID of the liquidity position
     * @param liquidityTokens Amount of LP tokens to burn
     * @param minTokenAAmount Minimum amount of token A to receive
     * @param minTokenBAmount Minimum amount of token B to receive
     */
    function removeLiquidity(
        uint256 positionId,
        uint256 liquidityTokens,
        uint256 minTokenAAmount,
        uint256 minTokenBAmount
    ) external nonReentrant whenNotPaused positionExists(positionId) onlyPositionOwner(positionId) {
        LiquidityPosition storage position = liquidityPositions[positionId];
        Pool storage pool = pools[position.poolId];

        require(liquidityTokens <= position.liquidityTokens, "Insufficient liquidity tokens");
        require(pool.status == PoolStatus.Active, "Pool is not active");

        // Calculate amounts to withdraw
        uint256 tokenAAmount = (liquidityTokens * pool.reserveA) / pool.totalSupply;
        uint256 tokenBAmount = (liquidityTokens * pool.reserveB) / pool.totalSupply;

        require(tokenAAmount >= minTokenAAmount, "Insufficient token A amount");
        require(tokenBAmount >= minTokenBAmount, "Insufficient token B amount");

        // Update position
        position.liquidityTokens -= liquidityTokens;
        position.tokenAAmount = (position.liquidityTokens * pool.reserveA) / pool.totalSupply;
        position.tokenBAmount = (position.liquidityTokens * pool.reserveB) / pool.totalSupply;

        // Update pool
        pool.reserveA -= tokenAAmount;
        pool.reserveB -= tokenBAmount;
        pool.totalSupply -= liquidityTokens;

        // Transfer tokens to user
        if (pool.tokenA != address(0)) {
            IERC20(pool.tokenA).safeTransfer(msg.sender, tokenAAmount);
        }
        if (pool.tokenB != address(0)) {
            IERC20(pool.tokenB).safeTransfer(msg.sender, tokenBAmount);
        }

        // Deactivate position if no liquidity left
        if (position.liquidityTokens == 0) {
            position.isActive = false;
        }

        emit LiquidityRemoved(
            positionId,
            position.poolId,
            msg.sender,
            tokenAAmount,
            tokenBAmount,
            liquidityTokens
        );
    }

    /**
     * @dev Execute a token swap
     * @param poolId ID of the pool
     * @param swapType Type of swap
     * @param tokenIn Input token
     * @param tokenOut Output token
     * @param amountIn Input amount (for exact input) or maximum input (for exact output)
     * @param amountOut Minimum output amount (for exact input) or exact output (for exact output)
     */
    function executeSwap(
        uint256 poolId,
        SwapType swapType,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    ) external payable nonReentrant whenNotPaused poolExists(poolId) poolActive(poolId) {
        require(msg.value >= platformFee, "Insufficient platform fee");

        Pool storage pool = pools[poolId];
        require((tokenIn == pool.tokenA && tokenOut == pool.tokenB) || 
                (tokenIn == pool.tokenB && tokenOut == pool.tokenA), "Invalid token pair");

        uint256 actualAmountIn;
        uint256 actualAmountOut;
        uint256 feeAmount;

        if (swapType == SwapType.ExactInput) {
            (actualAmountIn, actualAmountOut, feeAmount) = _calculateExactInputSwap(
                pool,
                tokenIn,
                tokenOut,
                amountIn
            );
            require(actualAmountOut >= amountOut, "Insufficient output amount");
        } else {
            (actualAmountIn, actualAmountOut, feeAmount) = _calculateExactOutputSwap(
                pool,
                tokenIn,
                tokenOut,
                amountOut
            );
            require(actualAmountIn <= amountIn, "Excessive input amount");
        }

        // Transfer input tokens to this contract
        if (tokenIn != address(0)) {
            IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), actualAmountIn);
        }

        // Update pool reserves
        if (tokenIn == pool.tokenA) {
            pool.reserveA += actualAmountIn;
            pool.reserveB -= actualAmountOut;
        } else {
            pool.reserveB += actualAmountIn;
            pool.reserveA -= actualAmountOut;
        }

        // Transfer output tokens to user
        if (tokenOut != address(0)) {
            IERC20(tokenOut).safeTransfer(msg.sender, actualAmountOut);
        }

        // Update pool statistics
        pool.swapCount++;
        pool.volume24h += actualAmountIn;
        pool.lastSwapTimestamp = block.timestamp;

        // Create swap request record
        _createSwapRequest(poolId, swapType, tokenIn, tokenOut, actualAmountIn, actualAmountOut, feeAmount);

        emit SwapExecuted(
            _requestIds.current(),
            poolId,
            msg.sender,
            tokenIn,
            tokenOut,
            actualAmountIn,
            actualAmountOut,
            feeAmount
        );
    }

    /**
     * @dev Verify a pool (only authorized verifiers)
     * @param poolId ID of the pool to verify
     */
    function verifyPool(uint256 poolId) external payable nonReentrant whenNotPaused onlyAuthorizedVerifier poolExists(poolId) {
        require(msg.value >= verificationFee, "Insufficient verification fee");

        Pool storage pool = pools[poolId];
        require(!pool.isVerified, "Pool already verified");
        require(pool.status == PoolStatus.Active, "Pool must be active for verification");

        pool.isVerified = true;
        pool.verificationTimestamp = block.timestamp;
        pool.verifier = msg.sender;

        emit PoolVerified(poolId, msg.sender, block.timestamp);
    }

    // =============================================================================
    // INTERNAL FUNCTIONS
    // =============================================================================

    /**
     * @dev Create a liquidity position
     * @param poolId ID of the pool
     * @param provider Address providing liquidity
     * @param amountA Amount of token A
     * @param amountB Amount of token B
     * @param liquidityTokens LP tokens to mint
     */
    function _createLiquidityPosition(
        uint256 poolId,
        address provider,
        uint256 amountA,
        uint256 amountB,
        uint256 liquidityTokens
    ) internal {
        _positionIds.increment();
        uint256 positionId = _positionIds.current();

        liquidityPositions[positionId] = LiquidityPosition({
            positionId: positionId,
            poolId: poolId,
            provider: provider,
            liquidityTokens: liquidityTokens,
            tokenAAmount: amountA,
            tokenBAmount: amountB,
            timestamp: block.timestamp,
            isActive: true,
            lastClaimTimestamp: block.timestamp,
            accumulatedFees: 0
        });

        userPositions[provider].push(positionId);
        userLiquidityVolume[provider] += amountA + amountB;

        emit LiquidityAdded(positionId, poolId, provider, amountA, amountB, liquidityTokens);
    }

    /**
     * @dev Create a swap request record
     * @param poolId ID of the pool
     * @param swapType Type of swap
     * @param tokenIn Input token
     * @param tokenOut Output token
     * @param amountIn Input amount
     * @param amountOut Output amount
     * @param feeAmount Fee amount
     */
    function _createSwapRequest(
        uint256 poolId,
        SwapType swapType,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 feeAmount
    ) internal {
        _requestIds.increment();
        uint256 requestId = _requestIds.current();

        swapRequests[requestId] = SwapRequest({
            requestId: requestId,
            poolId: poolId,
            swapType: swapType,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            amountOut: amountOut,
            minAmountOut: 0,
            maxAmountIn: 0,
            swapper: msg.sender,
            timestamp: block.timestamp,
            isExecuted: true,
            executionTimestamp: block.timestamp,
            feePaid: feeAmount,
            slippage: 0
        });

        userSwaps[msg.sender].push(requestId);
    }

    /**
     * @dev Calculate optimal amounts for adding liquidity
     * @param reserveA Current reserve of token A
     * @param reserveB Current reserve of token B
     * @param amountA Desired amount of token A
     * @param amountB Desired amount of token B
     * @return Optimal amounts for both tokens
     */
    function _calculateOptimalAmounts(
        uint256 reserveA,
        uint256 reserveB,
        uint256 amountA,
        uint256 amountB
    ) internal pure returns (uint256, uint256) {
        if (reserveA == 0 || reserveB == 0) {
            return (amountA, amountB);
        }

        uint256 optimalAmountB = (amountA * reserveB) / reserveA;
        if (optimalAmountB <= amountB) {
            return (amountA, optimalAmountB);
        } else {
            uint256 optimalAmountA = (amountB * reserveA) / reserveB;
            return (optimalAmountA, amountB);
        }
    }

    /**
     * @dev Calculate liquidity tokens to mint
     * @param reserveA Current reserve of token A
     * @param reserveB Current reserve of token B
     * @param amountA Amount of token A being added
     * @param amountB Amount of token B being added
     * @return Liquidity tokens to mint
     */
    function _calculateLiquidityTokens(
        uint256 reserveA,
        uint256 reserveB,
        uint256 amountA,
        uint256 amountB
    ) internal pure returns (uint256) {
        if (reserveA == 0 || reserveB == 0) {
            return Math.sqrt(amountA * amountB);
        }

        uint256 liquidityA = (amountA * reserveA) / reserveA;
        uint256 liquidityB = (amountB * reserveB) / reserveB;
        return Math.min(liquidityA, liquidityB);
    }

    /**
     * @dev Calculate exact input swap
     * @param pool Pool information
     * @param tokenIn Input token
     * @param tokenOut Output token
     * @param amountIn Input amount
     * @return Actual input amount, output amount, and fee
     */
    function _calculateExactInputSwap(
        Pool storage pool,
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal view returns (uint256, uint256, uint256) {
        uint256 feeAmount = (amountIn * pool.feeRate) / 10000;
        uint256 amountInAfterFee = amountIn - feeAmount;

        uint256 reserveIn = tokenIn == pool.tokenA ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = tokenIn == pool.tokenA ? pool.reserveB : pool.reserveA;

        uint256 amountOut = (amountInAfterFee * reserveOut) / (reserveIn + amountInAfterFee);

        return (amountIn, amountOut, feeAmount);
    }

    /**
     * @dev Calculate exact output swap
     * @param pool Pool information
     * @param tokenIn Input token
     * @param tokenOut Output token
     * @param amountOut Output amount
     * @return Actual input amount, output amount, and fee
     */
    function _calculateExactOutputSwap(
        Pool storage pool,
        address tokenIn,
        address tokenOut,
        uint256 amountOut
    ) internal view returns (uint256, uint256, uint256) {
        uint256 reserveIn = tokenIn == pool.tokenA ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = tokenIn == pool.tokenA ? pool.reserveB : pool.reserveA;

        uint256 amountInBeforeFee = (amountOut * reserveIn) / (reserveOut - amountOut);
        uint256 feeAmount = (amountInBeforeFee * pool.feeRate) / (10000 - pool.feeRate);
        uint256 amountIn = amountInBeforeFee + feeAmount;

        return (amountIn, amountOut, feeAmount);
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    /**
     * @dev Get pool information
     * @param poolId ID of the pool
     * @return Complete pool information
     */
    function getPool(uint256 poolId) external view poolExists(poolId) returns (Pool memory) {
        return pools[poolId];
    }

    /**
     * @dev Get liquidity position
     * @param positionId ID of the position
     * @return Position information
     */
    function getLiquidityPosition(uint256 positionId) external view positionExists(positionId) returns (LiquidityPosition memory) {
        return liquidityPositions[positionId];
    }

    /**
     * @dev Get swap request
     * @param requestId ID of the request
     * @return Swap request information
     */
    function getSwapRequest(uint256 requestId) external view returns (SwapRequest memory) {
        return swapRequests[requestId];
    }

    /**
     * @dev Get user positions
     * @param user Address of the user
     * @return Array of position IDs
     */
    function getUserPositions(address user) external view returns (uint256[] memory) {
        return userPositions[user];
    }

    /**
     * @dev Get user swaps
     * @param user Address of the user
     * @return Array of request IDs
     */
    function getUserSwaps(address user) external view returns (uint256[] memory) {
        return userSwaps[user];
    }

    /**
     * @dev Get total number of pools
     * @return Total pool count
     */
    function getTotalPoolCount() external view returns (uint256) {
        return _poolIds.current();
    }

    /**
     * @dev Get total number of positions
     * @return Total position count
     */
    function getTotalPositionCount() external view returns (uint256) {
        return _positionIds.current();
    }

    /**
     * @dev Get total number of swaps
     * @return Total swap count
     */
    function getTotalSwapCount() external view returns (uint256) {
        return _requestIds.current();
    }

    /**
     * @dev Calculate swap output for given input
     * @param poolId ID of the pool
     * @param tokenIn Input token
     * @param amountIn Input amount
     * @return Output amount and fee
     */
    function calculateSwapOutput(
        uint256 poolId,
        address tokenIn,
        uint256 amountIn
    ) external view poolExists(poolId) returns (uint256 amountOut, uint256 feeAmount) {
        Pool storage pool = pools[poolId];
        require((tokenIn == pool.tokenA) || (tokenIn == pool.tokenB), "Invalid input token");

        (uint256 actualAmountIn, uint256 actualAmountOut, uint256 actualFee) = _calculateExactInputSwap(
            pool,
            tokenIn,
            tokenIn == pool.tokenA ? pool.tokenB : pool.tokenA,
            amountIn
        );

        return (actualAmountOut, actualFee);
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
     * @dev Update pool fee rate
     * @param poolId ID of the pool
     * @param newFeeRate New fee rate
     */
    function updatePoolFee(uint256 poolId, uint256 newFeeRate) external onlyOwner poolExists(poolId) validFeeRate(newFeeRate) {
        Pool storage pool = pools[poolId];
        uint256 oldFee = pool.feeRate;
        pool.feeRate = newFeeRate;

        emit PoolFeeUpdated(poolId, oldFee, newFeeRate);
    }

    /**
     * @dev Change pool status
     * @param poolId ID of the pool
     * @param newStatus New status
     */
    function changePoolStatus(uint256 poolId, PoolStatus newStatus) external onlyOwner poolExists(poolId) {
        Pool storage pool = pools[poolId];
        PoolStatus oldStatus = pool.status;
        pool.status = newStatus;

        emit PoolStatusChanged(poolId, oldStatus, newStatus);
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
     * @dev Emergency function to change pool status (owner only)
     * @param poolId ID of the pool
     * @param newStatus New status
     */
    function emergencyChangePoolStatus(uint256 poolId, PoolStatus newStatus) external onlyOwner poolExists(poolId) {
        Pool storage pool = pools[poolId];
        PoolStatus oldStatus = pool.status;
        pool.status = newStatus;

        emit PoolStatusChanged(poolId, oldStatus, newStatus);
    }

    /**
     * @dev Emergency function to revoke verification (owner only)
     * @param poolId ID of the pool
     */
    function emergencyRevokeVerification(uint256 poolId) external onlyOwner poolExists(poolId) {
        Pool storage pool = pools[poolId];
        require(pool.isVerified, "Pool is not verified");

        pool.isVerified = false;
        pool.verificationTimestamp = 0;
        pool.verifier = address(0);
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