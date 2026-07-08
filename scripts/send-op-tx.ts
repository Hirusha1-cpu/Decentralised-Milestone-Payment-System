// scripts/send-op-tx.ts - FIXED
import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

// Import ABI
import EscrowArtifact from "../artifacts/contracts/Escrow.sol/Escrow.json";

async function main() {
    console.log("=".repeat(60));
    console.log("📝 Escrow Contract Interaction");
    console.log("=".repeat(60));

    // 1. Load deployment info
    const deploymentPath = path.join(__dirname, `../deployments/${network.name}.json`);
    
    if (!fs.existsSync(deploymentPath)) {
        console.error(`❌ deployments/${network.name}.json not found!`);
        console.log(`\n💡 Please deploy first:`);
        console.log(`   npx hardhat run scripts/deploy.ts --network ${network.name}`);
        process.exit(1);
    }
    
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contractAddress = deployment.address;
    console.log(`\n📍 Contract Address: ${contractAddress}`);
    console.log(`🌐 Network: ${network.name}`);

    // 2. Get signers with fallback
    let client, freelancer, arbitrator;
    
    try {
        const signers = await ethers.getSigners();
        
        if (signers.length === 0) {
            console.error("❌ No signers found!");
            console.log("💡 Please make sure you have accounts configured in hardhat.config.ts");
            process.exit(1);
        }
        
        client = signers[0];
        freelancer = signers[1] || signers[0];
        arbitrator = signers[2] || signers[0];
        
        console.log(`\n👤 Client: ${client.address}`);
        console.log(`👤 Freelancer: ${freelancer.address}`);
        console.log(`👤 Arbitrator: ${arbitrator.address}`);
        
    } catch (error) {
        console.error("❌ Error getting signers:", error);
        console.log("💡 Try using hardhat node with local accounts");
        process.exit(1);
    }

    // 3. Load ABI
    const artifactPath = path.join(__dirname, "../artifacts/contracts/Escrow.sol/Escrow.json");
    
    if (!fs.existsSync(artifactPath)) {
        console.error("❌ Artifact file not found!");
        console.log("\n💡 Please compile first:");
        console.log("   npx hardhat compile");
        process.exit(1);
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abi = artifact.abi;
    console.log(`\n✅ ABI loaded`);

    // 4. Create contract instance
    const escrow = await ethers.getContractAt(abi, contractAddress, client);
    console.log("✅ Contract instance created");

    // 5. Test flow
    console.log("\n" + "=".repeat(60));
    console.log("🧪 Testing Full Flow");
    console.log("=".repeat(60));

    try {
        // Step 1: Get initial escrow count
        const initialCount = await escrow.escrowCounter();
        console.log(`\n📊 Initial escrow count: ${initialCount}`);

        // Step 2: Create escrow
        console.log("\n1️⃣ Creating escrow...");
        const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        
        const tx1 = await escrow.createEscrow(
            freelancer.address,
            arbitrator.address,
            deadline,
            { value: ethers.parseEther("0.01") }
        );
        console.log(`   ⏳ Transaction: ${tx1.hash}`);
        await tx1.wait();
        console.log("   ✅ Escrow created!");

        // Step 3: Get escrow ID
        const newCount = await escrow.escrowCounter();
        const escrowId = Number(newCount);
        console.log(`   📋 Escrow ID: ${escrowId}`);

        // Step 4: Complete milestone
        console.log("\n2️⃣ Completing milestone...");
        const escrowAsFreelancer = await ethers.getContractAt(
            abi,
            contractAddress,
            freelancer
        );
        const tx2 = await escrowAsFreelancer.completeMilestone(escrowId);
        console.log(`   ⏳ Transaction: ${tx2.hash}`);
        await tx2.wait();
        console.log("   ✅ Milestone completed!");

        // Step 5: Check state before release
        const stateBefore = await escrow.getState(escrowId);
        console.log(`   📊 State before release: ${stateBefore}`);

        // Step 6: Approve and release
        console.log("\n3️⃣ Approving and releasing funds...");
        const tx3 = await escrow.approveAndRelease(escrowId);
        console.log(`   ⏳ Transaction: ${tx3.hash}`);
        await tx3.wait();
        console.log("   ✅ Funds released!");

        // Step 7: Check final state
        const stateAfter = await escrow.getState(escrowId);
        const stateNames = ["Pending", "Completed", "Released", "Disputed", "Resolved", "Refunded"];
        console.log(`\n📊 Final state: ${stateNames[Number(stateAfter)]}`);

        // Step 8: Check freelancer balance
        const balance = await ethers.provider.getBalance(freelancer.address);
        console.log(`💰 Freelancer balance: ${ethers.formatEther(balance)} ETH`);

        console.log("\n" + "=".repeat(60));
        console.log("✅ All tests passed!");
        console.log("=".repeat(60));

    } catch (error: any) {
        console.error("\n❌ Error:", error.message);
        if (error.data) {
            console.error("📊 Data:", error.data);
        }
        if (error.transaction) {
            console.error("📝 Transaction:", error.transaction);
        }
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exitCode = 1;
});