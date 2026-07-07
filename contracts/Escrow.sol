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
    // checks the state is correct
    modifier inState(uint256 escrowId, EscrowLibrary.State state) {
        if (escrows[escrowId].currentState != state) revert Errors.InvalidState();
        _;
    }

    // escrow create function
    function createEscrow( address freelancer,address arbitrator,uint256 deadline) external payable override returns (uint256) {
        if (msg.value == 0) revert Errors.InsufficientFunds();
        if (freelancer == address(0)) revert Errors.InvalidAddress();
        if (arbitrator == address(0)) revert Errors.InvalidAddress();
        if (deadline <= block.timestamp) revert Errors.InvalidDeadline();

        escrowCounter++;
        // add the new escrow into array
        escrows[escrowCounter] = EscrowLibrary.EscrowData({
            client: msg.sender,
            freelancer: freelancer,
            arbitrator: arbitrator,
            amount: msg.value,
            deadline: deadline,
            currentState: EscrowLibrary.State.Pending,
            createdAt: block.timestamp,
            milestoneCompleted: false
        });
        //emit the escrow created event
        emit EscrowCreated(
            escrowCounter,
            msg.sender,
            freelancer,
            msg.value,
            deadline
        );

        return escrowCounter;

    }

    // function that complete the freelancer side work for the client and relase for the approval onnly this function can call freelancer and state should be pending
    function completeMilestone(uint256 escrowId) external override onlyFreelancer(escrowId) inState(escrowId, EscrowLibrary.State.Pending) {
        // mark the milestone as completed
        escrows[escrowId].milestoneCompleted = true;
        // pending -> completed
        escrows[escrowId].currentState = EscrowLibrary.State.Completed;
        // emits the milestone completed event
        emit MilestoneCompleted(escrowId, msg.sender);
    }

    // function that get approval from the client and relase the funds for the freelancer and non-reentrant to prevent reentrancy attacks
    function approveAndRelease(uint256 escrowId) external override onlyClient(escrowId) inState(escrowId, EscrowLibrary.State.Completed), nonReentrant {
        // get the escrow data
        EscrowLibrary.EscrowData storage escrow = escrows[escrowId];
        // check if the milestone is completed
        if (!escrow.milestoneCompleted) revert Errors.MilestoneNotComplete();
        // mark the escrow as released
        escrow.currentState = EscrowLibrary.State.Released;
        // get the amount to be released
        uint256 amount = escrow.amount;
        // set the amount to 0 to prevent reentrancy attacks
        escrow.amount = 0;
        // relase the funds to the freelancer
        (bool success, ) = escrow.freelancer.call{value: amount}("");
        if (!success) revert Errors.TransferFailed();
        // emit the funds released event
        emit FundsReleased(escrowId, msg.sender, amount);
    }





}