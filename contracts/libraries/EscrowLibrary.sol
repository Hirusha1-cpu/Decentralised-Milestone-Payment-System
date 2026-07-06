// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library EscrowLibrary {
    // ========== ENUMS ==========
    enum State {
        Pending,      // 0 - Escrow created, waiting for work
        Completed,    // 1 - Work completed by freelancer
        Released,     // 2 - Funds released to freelancer
        Disputed,     // 3 - Dispute raised
        Resolved,     // 4 - Dispute resolved by arbitrator
        Refunded      // 5 - Funds refunded to client
    }

    // ========== STRUCTS ==========
    struct EscrowData {
        address client;              // Who pays
        address freelancer;          // Who works
        address arbitrator;          // Who resolves disputes
        uint256 amount;              // Amount locked
        uint256 deadline;            // Expiry timestamp
        State currentState;          // Current state
        uint256 createdAt;           // Creation timestamp
        bool milestoneCompleted;     // Work done flag
    }

    // ========== HELPER FUNCTIONS ==========
    function isValidState(State state) internal pure returns (bool) {
        return uint8(state) >= 0 && uint8(state) <= 5;
    }
}