// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {EscrowLibrary} from "../libraries/EscrowLibrary.sol";

interface IEscrow {
    // ========== CORE FUNCTIONS ==========
    function createEscrow(
        address freelancer,
        address arbitrator,
        uint256 deadline
    ) external payable returns (uint256);

    function completeMilestone(uint256 escrowId) external;

    function approveAndRelease(uint256 escrowId) external;

    function raiseDispute(uint256 escrowId) external;

    function resolveDispute(uint256 escrowId, address winner) external;

    function refund(uint256 escrowId) external;

    // ========== VIEW FUNCTIONS ==========
    function getEscrowDetails(uint256 escrowId) 
        external 
        view 
        returns (EscrowLibrary.EscrowData memory);

    function getState(uint256 escrowId) 
        external 
        view 
        returns (EscrowLibrary.State);

    function getEscrowCounter() 
        external 
        view 
        returns (uint256);
}