import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

// Import ABI
import EscrowArtifact from "../artifacts/contracts/Escrow.sol/Escrow.json";

async function main() {
    // Load deployment address
    const deploymentPath = path.join(__dirname, "../deployments/sepolia.json");
    
    // Check if file exists
    if (!fs.existsSync(deploymentPath)) {
        console.error("❌ deployments/sepolia.json not found!");
        console.log("💡 First deploy to Sepolia:");
        console.log("   npx hardhat run scripts/deploy.ts --network sepolia");
        process.exit(1);
    }
    
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contractAddress = deployment.address;
    
    console.log(`📝 Interacting with contract at: ${contractAddress}`);
    
    // Get signers
    const [client, freelancer, arbitrator] = await ethers.getSigners();
    
    console.log(`📝 Client: ${client.address}`);
    console.log(`📝 Freelancer: ${freelancer.address}`);
    console.log(`📝 Arbitrator: ${arbitrator.address}`);
    
    // Create contract instances
    const escrow = await ethers.getContractAt(
        EscrowArtifact.abi,
        contractAddress,
        client
    );
    
    console.log("\n📝 Testing Escrow Contract...");
    
    // 1. Create escrow
    console.log("\n1️⃣ Creating escrow...");
    const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const tx1 = await escrow.createEscrow(
        freelancer.address,
        arbitrator.address,
        deadline,
        { value: ethers.parseEther("1.0") }
    );
    await tx1.wait();
    console.log("✅ Escrow created!");
    
    // 2. Complete milestone
    console.log("\n2️⃣ Completing milestone...");
    const escrowAsFreelancer = await ethers.getContractAt(
        EscrowArtifact.abi,
        contractAddress,
        freelancer
    );
    const tx2 = await escrowAsFreelancer.completeMilestone(1);
    await tx2.wait();
    console.log("✅ Milestone completed!");
    
    // 3. Approve and release
    console.log("\n3️⃣ Approving and releasing funds...");
    const escrowAsClient = await ethers.getContractAt(
        EscrowArtifact.abi,
        contractAddress,
        client
    );
    const tx3 = await escrowAsClient.approveAndRelease(1);
    await tx3.wait();
    console.log("✅ Funds released!");
    
    // 4. Check state
    const state = await escrow.getState(1);
    console.log(`\n📊 Current state: ${state}`);
    
    // State mapping
    const stateNames = ["Pending", "Completed", "Released", "Disputed", "Resolved", "Refunded"];
    console.log(`📊 State: ${stateNames[Number(state)]}`);
    
    // 5. Check balance
    const balance = await ethers.provider.getBalance(freelancer.address);
    console.log(`💰 Freelancer balance: ${ethers.formatEther(balance)} ETH`);
    
    console.log("\n✅ All tests passed!");
}

main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exitCode = 1;
});