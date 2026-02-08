// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

/**
 * @title NewUserChallenge
 * @notice Onboarding challenge: stake $5, join a goal within 24h or forfeit to platform
 * @dev Users can only join once ever. Uses Chainlink Functions to verify goal participation.
 */
contract NewUserChallenge is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    // ═══════════════════════════════════════════════════════════════════
    // STRUCTS & STATE
    // ═══════════════════════════════════════════════════════════════════

    struct Challenge {
        uint256 amount;         // Amount staked (5 USDC)
        uint256 deadline;       // Timestamp when 24h expires
        bool settled;           // Whether challenge has been settled
        bool won;               // Whether user won (joined a goal)
    }

    // Core state
    IERC20 public immutable usdc;
    address public immutable goalStakeV3;
    address public treasury;
    address public owner;

    // Challenge parameters
    uint256 public stakeAmount = 5 * 1e6;  // 5 USDC (6 decimals)
    uint256 public challengeDuration = 24 hours;

    // User challenges (one per user, ever)
    mapping(address => Challenge) public challenges;
    mapping(address => bool) public hasJoinedChallenge;

    // Chainlink Functions
    bytes32 public donId;
    uint64 public subscriptionId;
    uint32 public gasLimit = 300_000;
    bytes public verificationSource;

    // Track pending verifications
    mapping(bytes32 => address) public pendingRequests;

    // Stats
    uint256 public totalChallenges;
    uint256 public totalWon;
    uint256 public totalForfeited;

    // ═══════════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════════

    event ChallengeJoined(address indexed user, uint256 amount, uint256 deadline);
    event ChallengeSettled(address indexed user, bool won, uint256 amount);
    event VerificationRequested(bytes32 indexed requestId, address indexed user);
    event TreasuryUpdated(address oldTreasury, address newTreasury);

    // ═══════════════════════════════════════════════════════════════════
    // ERRORS
    // ═══════════════════════════════════════════════════════════════════

    error AlreadyJoined();
    error NotJoined();
    error AlreadySettled();
    error DeadlineNotReached();
    error OnlyOwner();
    error TransferFailed();

    // ═══════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════

    constructor(
        address _usdc,
        address _goalStakeV3,
        address _treasury,
        address _functionsRouter,
        bytes32 _donId,
        uint64 _subscriptionId
    ) FunctionsClient(_functionsRouter) {
        usdc = IERC20(_usdc);
        goalStakeV3 = _goalStakeV3;
        treasury = _treasury;
        owner = msg.sender;
        donId = _donId;
        subscriptionId = _subscriptionId;
    }

    // ═══════════════════════════════════════════════════════════════════
    // USER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Join the new user challenge by staking $5 USDC
     * @dev User must approve USDC transfer first. Can only join once ever.
     */
    function join() external {
        if (hasJoinedChallenge[msg.sender]) revert AlreadyJoined();

        // Transfer stake from user
        bool success = usdc.transferFrom(msg.sender, address(this), stakeAmount);
        if (!success) revert TransferFailed();

        // Record challenge
        challenges[msg.sender] = Challenge({
            amount: stakeAmount,
            deadline: block.timestamp + challengeDuration,
            settled: false,
            won: false
        });
        hasJoinedChallenge[msg.sender] = true;
        totalChallenges++;

        emit ChallengeJoined(msg.sender, stakeAmount, block.timestamp + challengeDuration);
    }

    /**
     * @notice Request settlement verification for a user
     * @dev Can be called by anyone after deadline. Uses Chainlink Functions.
     */
    function requestSettlement(address user) external {
        Challenge storage c = challenges[user];
        
        if (!hasJoinedChallenge[user]) revert NotJoined();
        if (c.settled) revert AlreadySettled();
        if (block.timestamp < c.deadline) revert DeadlineNotReached();

        // Build Chainlink Functions request
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(string(verificationSource));
        
        // Pass user address and GoalStakeV3 address as args
        string[] memory args = new string[](2);
        args[0] = _addressToString(user);
        args[1] = _addressToString(goalStakeV3);
        req.setArgs(args);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donId
        );

        pendingRequests[requestId] = user;
        emit VerificationRequested(requestId, user);
    }

    /**
     * @notice Chainlink Functions callback
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory /* err */
    ) internal override {
        address user = pendingRequests[requestId];
        if (user == address(0)) return;

        Challenge storage c = challenges[user];
        if (c.settled) return;

        // Parse response: "1" = won (joined a goal), "0" = lost
        bool won = keccak256(response) == keccak256(bytes("1"));
        
        c.settled = true;
        c.won = won;

        if (won) {
            // Refund user
            totalWon++;
            usdc.transfer(user, c.amount);
        } else {
            // Send to treasury
            totalForfeited++;
            usdc.transfer(treasury, c.amount);
        }

        delete pendingRequests[requestId];
        emit ChallengeSettled(user, won, c.amount);
    }

    // ═══════════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    function getChallenge(address user) external view returns (
        uint256 amount,
        uint256 deadline,
        bool settled,
        bool won,
        bool canSettle
    ) {
        Challenge memory c = challenges[user];
        return (
            c.amount,
            c.deadline,
            c.settled,
            c.won,
            block.timestamp >= c.deadline && !c.settled
        );
    }

    function getStats() external view returns (
        uint256 _totalChallenges,
        uint256 _totalWon,
        uint256 _totalForfeited,
        uint256 _pendingAmount
    ) {
        uint256 pending = totalChallenges - totalWon - totalForfeited;
        return (totalChallenges, totalWon, totalForfeited, pending * stakeAmount);
    }

    // ═══════════════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    function setVerificationSource(bytes calldata _source) external onlyOwner {
        verificationSource = _source;
    }

    function setTreasury(address _treasury) external onlyOwner {
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function setStakeAmount(uint256 _amount) external onlyOwner {
        stakeAmount = _amount;
    }

    function setChallengeDuration(uint256 _duration) external onlyOwner {
        challengeDuration = _duration;
    }

    function setGasLimit(uint32 _gasLimit) external onlyOwner {
        gasLimit = _gasLimit;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    // ═══════════════════════════════════════════════════════════════════
    // INTERNAL HELPERS
    // ═══════════════════════════════════════════════════════════════════

    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
