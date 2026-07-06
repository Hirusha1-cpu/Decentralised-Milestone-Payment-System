// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Errors {
    // ========== ACCESS CONTROL ERRORS ==========
    error NotClient();
    error NotFreelancer();
    error NotArbitrator();
    error NotClientOrFreelancer();
    
    // ========== STATE ERRORS ==========
    error InvalidState();
    error MilestoneNotComplete();
    error DeadlineNotPassed();
    error AlreadyResolved();
    
    // ========== INPUT ERRORS ==========
    error InsufficientFunds();
    error InvalidAddress();
    error InvalidDeadline();
    error InvalidWinner();
    
    // ========== TRANSFER ERRORS ==========
    error TransferFailed();
}