// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IEscrow} from "./interfaces/IEscrow.sol";
import {EscrowLibrary} from "./libraries/EscrowLibrary.sol";
import {Errors} from "./utils/Errors.sol";

contract Escrow is ReentrancyGuard, IEscrow {
    using EscrowLibrary for EscrowLibrary.EscrowData;

    uint256 public escrowCounter;
    mapping(uint256 => EscrowLibrary.EscrowData) public escrows;

    // ========== CORE FUNCTIONS ==========
    // this is the escrow creation event, which is called by the client to create a new escrow
    event EscrowCreated(
        uint256 indexed id,
        address indexed client,
        address indexed freelancer,
        uint256 amount,
        uint256 deadline
    );
    // this is the event that calls when the freelancer completes the milestone, which is called by the freelancer to complete the milestone
    event MilestoneCompleted(
        uint256 indexed id,
        address indexed freelancer
    );

    // this is the evet that raised when funds are relesed to the freelancer, which is called by the client to release the funds to the freelancer
     event FundsReleased(
        uint256 indexed id,
        address indexed recipient,
        uint256 amount
    );

    // thiis the event that raise a dispute when having some issues, which is called by the client or freelancer to raise a dispute
    event DisputeRaised(
        uint256 indexed id,
        address indexed raiser
    );

    // this is the event that raised when the dispute is resolved.
    event DisputeResolved(
        uint256 indexed id,
        address indexed winner,
        uint256 amount
    );

    // when refunded
    event Refunded(
        uint256 indexed id,
        address indexed recipient,
        uint256 amount
    );

    // ========== MODIFIERS ==========
    // checks is this client
     modifier onlyClient(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].client) revert Errors.NotClient();
        _;
    }
    // cheks is this freelancer
    modifier onlyFreelancer(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].freelancer) revert Errors.NotFreelancer();
        _;
    }
    // checks is this arbitrator
    modifier onlyArbitrator(uint256 escrowId) {
        if (msg.sender != escrows[escrowId].arbitrator) revert Errors.NotArbitrator();
        _;
    }

    modifier inState(uint256 escrowId, EscrowLibrary.State state) {
        if (escrows[escrowId].currentState != state) revert Errors.InvalidState();
        _;
    }




}