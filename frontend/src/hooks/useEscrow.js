import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContractAddress, ESCROW_STATES } from '../utils/constants';
import { CONTRACT_ABI } from '../utils/abi';

export function useEscrow(signer, chainId) {   // 👈 chainId parameter අලුතින්
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [transactionHash, setTransactionHash] = useState(null);

    const getContract = useCallback(() => {
        if (!signer) {
            throw new Error('Wallet not connected');
        }
        const address = getContractAddress(chainId);   // 👈 chainId අනුව address
        return new ethers.Contract(address, CONTRACT_ABI, signer);
    }, [signer, chainId]);

    const createEscrow = useCallback(async (freelancer, arbitrator, deadline, amount) => {
        setIsLoading(true);
        setError(null);
        setTransactionHash(null);

        try {
            const contract = await getContract();
            const tx = await contract.createEscrow(
                freelancer,
                arbitrator,
                deadline,
                { value: ethers.parseEther(amount) }
            );

            setTransactionHash(tx.hash);
            const receipt = await tx.wait();

            // Get escrow ID from events
            const event = receipt.logs.find(
                log => log.topics[0] === ethers.id('EscrowCreated(uint256,address,address,uint256,uint256)')
            );

            const escrowId = event ? Number(event.topics[1]) : await contract.escrowCounter();
            return { success: true, escrowId, transactionHash: tx.hash };
        } catch (error) {
            console.error('❌ Create escrow error:', error);
            // Better error messages
            let errorMessage = error.reason || error.message;

            if (errorMessage.includes("insufficient funds")) {
                errorMessage = "❌ Insufficient ETH balance. Please add funds to your wallet.";
            } else if (errorMessage.includes("InvalidAddress")) {
                errorMessage = "❌ Invalid address. Please check the address and try again.";
            } else if (errorMessage.includes("InvalidDeadline")) {
                errorMessage = "❌ Deadline must be in the future. Please select a future date.";
            } else if (errorMessage.includes("InsufficientFunds")) {
                errorMessage = "❌ Amount must be greater than 0. Please enter a valid amount.";
            } else if (errorMessage.includes("missing revert data")) {
                errorMessage = "❌ Transaction failed. Please check:\n" +
                    "• You have enough ETH (0.1 ETH needed)\n" +
                    "• Addresses are valid\n" +
                    "• Deadline is in the future";
            }
            setError(error.reason || error.message);
            return { success: false, error: error.reason || error.message };
        } finally {
            setIsLoading(false);
        }
    }, [getContract]); // only render if changes this getContract

    // Complete Milestone
    const completeMilestone = useCallback(async (escrowId) => {
        setIsLoading(true);
        setError(null);
        setTransactionHash(null);

        try {
            const contract = getContract();
            const tx = await contract.completeMilestone(escrowId);
            setTransactionHash(tx.hash);
            await tx.wait();
            return { success: true, transactionHash: tx.hash };
        } catch (error) {
            console.error('❌ Complete milestone error:', error);
            setError(error.reason || error.message);
            return { success: false, error: error.reason || error.message };
        } finally {
            setIsLoading(false);
        }
    }, [getContract]);

    // Approve and Release
    const approveAndRelease = useCallback(async (escrowId) => {
        setIsLoading(true);
        setError(null);
        setTransactionHash(null);

        try {
            const contract = getContract();
            const tx = await contract.approveAndRelease(escrowId);
            setTransactionHash(tx.hash);
            await tx.wait();
            return { success: true, transactionHash: tx.hash };
        } catch (error) {
            console.error('❌ Approve & release error:', error);
            setError(error.reason || error.message);
            return { success: false, error: error.reason || error.message };
        } finally {
            setIsLoading(false);
        }
    }, [getContract]);


    // Raise Dispute
    const raiseDispute = useCallback(async (escrowId) => {
        setIsLoading(true);
        setError(null);
        setTransactionHash(null);

        try {
            const contract = getContract();
            const tx = await contract.raiseDispute(escrowId);
            setTransactionHash(tx.hash);
            await tx.wait();
            return { success: true, transactionHash: tx.hash };
        } catch (error) {
            console.error('❌ Raise dispute error:', error);
            setError(error.reason || error.message);
            return { success: false, error: error.reason || error.message };
        } finally {
            setIsLoading(false);
        }
    }, [getContract]);

    // Resolve Dispute
    const resolveDispute = useCallback(async (escrowId, winner) => {
        setIsLoading(true);
        setError(null);
        setTransactionHash(null);

        try {
            const contract = getContract();
            const tx = await contract.resolveDispute(escrowId, winner);
            setTransactionHash(tx.hash);
            await tx.wait();
            return { success: true, transactionHash: tx.hash };
        } catch (error) {
            console.error('❌ Resolve dispute error:', error);
            setError(error.reason || error.message);
            return { success: false, error: error.reason || error.message };
        } finally {
            setIsLoading(false);
        }
    }, [getContract]);

    // Refund
    const refund = useCallback(async (escrowId) => {
        setIsLoading(true);
        setError(null);
        setTransactionHash(null);

        try {
            const contract = getContract();
            const tx = await contract.refund(escrowId);
            setTransactionHash(tx.hash);
            await tx.wait();
            return { success: true, transactionHash: tx.hash };
        } catch (error) {
            console.error('❌ Refund error:', error);
            setError(error.reason || error.message);
            return { success: false, error: error.reason || error.message };
        } finally {
            setIsLoading(false);
        }
    }, [getContract]);

    // Get Escrow Details
    const getEscrowDetails = useCallback(async (escrowId, provider) => {
        try {
            const network = await provider.getNetwork();
            const address = getContractAddress(Number(network.chainId));
            const contract = new ethers.Contract(address, CONTRACT_ABI, provider);
            const details = await contract.getEscrowDetails(escrowId);

            return {
                client: details.client,
                freelancer: details.freelancer,
                arbitrator: details.arbitrator,
                amount: ethers.formatEther(details.amount),
                deadline: new Date(Number(details.deadline) * 1000).toLocaleString(),
                state: ESCROW_STATES[Number(details.currentState)] || 'Unknown',
                stateId: Number(details.currentState),
                createdAt: new Date(Number(details.createdAt) * 1000).toLocaleString(),
                milestoneCompleted: details.milestoneCompleted
            };
        } catch (error) {
            console.error('❌ Get details error:', error);
            return null;
        }
    }, []);

    // Get Escrow Counter
    const getEscrowCounter = useCallback(async (provider) => {
        try {
            const network = await provider.getNetwork();
            const address = getContractAddress(Number(network.chainId));
            const contract = new ethers.Contract(address, CONTRACT_ABI, provider);
            const counter = await contract.escrowCounter();
            return Number(counter);
        } catch (error) {
            console.error('❌ Get counter error:', error);
            return 0;
        }
    }, []);


    return {
        createEscrow,
        completeMilestone,
        approveAndRelease,
        raiseDispute,
        resolveDispute,
        refund,
        getEscrowDetails,
        getEscrowCounter,
        isLoading,
        error,
        transactionHash
    };


}