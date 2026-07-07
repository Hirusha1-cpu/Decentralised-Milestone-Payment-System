// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/Escrow.sol";
import "../contracts/libraries/EscrowLibrary.sol";

contract EscrowTest is Test {
    Escrow public escrow;
    address public client = address(0x1);
    address public freelancer = address(0x2);
    address public arbitrator = address(0x3);
    address public attacker = address(0x4);
    uint256 public constant AMOUNT = 1 ether;
    uint256 public constant DEADLINE = 7 days;

    // new setup function to deploy the contract before each test
    function setUp()  public {
        escrow = new Escrow();
        vm.deal(client, AMOUNT * 10);
        vm.deal(attacker, AMOUNT);
    }

    // function for create the escrow
    function test_CreateEscrow() public {
        // start with another address with client role
        vm.startPrank(client);
        // create escrow with valid parameters
        escrow.createEscrow{value: AMOUNT}(freelancer, arbitrator, block.timestamp + DEADLINE);
        // stop the prank to reset the msg.sender
        vm.stopPrank();
        // save the escrow data in to memory 
        EscrowLibrary.EscrowData memory data = escrow.getEscrowDetails(1);
        assertEq(data.client, client);
        assertEq(data.freelancer, freelancer);
        assertEq(data.amount, AMOUNT);
        assertEq(uint8(data.currentState), uint8(EscrowLibrary.State.Pending));
    }

    // function for complete milestone
    function test_CompleteMilestone() public {
        _createEscrow();
        vm.startPrank(freelancer);
        escrow.completeMilestone(1);
        vm.stopPrank();         

        EscrowLibrary.EscrowData memory data = escrow.getEscrowDetails(1);
        assertTrue(data.milestoneCompleted);
        assertEq(uint8(data.currentState), uint8(EscrowLibrary.State.Completed));
    }   

    // function for test the approvals and release of funds
    function test_ApproveAndRelease() public {
         _createEscrow();
         _completeMilestone();

        uint256 balanceBefore = freelancer.balance;
        vm.startPrank(client);
        escrow.approveAndRelease(1);
        vm.stopPrank();
        uint256 balanceAfter = freelancer.balance;
        assertEq(balanceAfter - balanceBefore, AMOUNT);
        assertEq(uint8(escrow.getState(1)), uint8(EscrowLibrary.State.Released));

    }  

    // function for test the dispute and raise the dispute
    function test_RaiseDispute() public {
        _createEscrow();
        _completeMilestone();
        
        vm.startPrank(client);
        escrow.raiseDispute(1);
        vm.stopPrank();

        assertEq(uint8(escrow.getState(1)), uint8(EscrowLibrary.State.Disputed));
    }   

    // function for test the dispute and resolve the dispute
    function test_ResolveDispute()  public {
        // create the escrow, complete the milestone and raise the dispute
        _createEscrow();
        _completeMilestone();
        _raiseDispute();

        uint256 balanceBefore = client.balance;
        vm.startPrank(arbitrator);
        // consider winner as client and resolve the dispute
        escrow.resolveDispute(1, client);
        vm.stopPrank();
        uint256 balanceAfter = client.balance;
        assertEq(balanceAfter - balanceBefore, AMOUNT);
        assertEq(uint8(escrow.getState(1)), uint8(EscrowLibrary.State.Resolved));

    }

    // functionn for refund process
    function test_Refund() public {
        // first create the escrow and warp the time to pass the deadline
        _createEscrow();
        // warp means forward the time stamp to pass the deadline
        vm.warp(block.timestamp + DEADLINE + 1);
        uint256 balanceBefore = client.balance;
        vm.startPrank(client);
        escrow.refund(1);
        vm.stopPrank();
        uint256 balanceAfter = client.balance;
        assertEq(balanceAfter - balanceBefore, AMOUNT); 
        assertEq(uint8(escrow.getState(1)), uint8(EscrowLibrary.State.Refunded));
    }

    // function for test the revert error when attacker tries to approve and release funds
     function test_Revert_NotClient() public {
        _createEscrow();
        _completeMilestone();
        
        vm.startPrank(attacker);
        // expect the revert error to be NotClient when attacker tries to approve and release funds
        vm.expectRevert(Errors.NotClient.selector);
        escrow.approveAndRelease(1);
        vm.stopPrank();
    }

    // function for test the revert error when attacker tries to raise dispute
    function _createEscrow() internal {
        vm.startPrank(client);
        escrow.createEscrow{value: AMOUNT}(freelancer, arbitrator, block.timestamp + DEADLINE);
        vm.stopPrank();
    }
    
    function _completeMilestone() internal {
        vm.startPrank(freelancer);
        escrow.completeMilestone(1);
        vm.stopPrank();
    }

    function _raiseDispute() internal {
        vm.startPrank(client);
        escrow.raiseDispute(1);
        vm.stopPrank();
    }






}