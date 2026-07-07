// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Errors {
    // Access Control
    error NotClient();
    error NotFreelancer();
    error NotArbitrator();
    error NotClientOrFreelancer();
    
    // State
    error InvalidState();
    error MilestoneNotComplete();
    error DeadlineNotPassed();
    error AlreadyResolved();
    
    // Input
    error InsufficientFunds();
    error InvalidAddress();
    error InvalidDeadline();
    error InvalidWinner();
    
    // Transfer
    error TransferFailed();
}