import { ethers } from "hardhat";

async function main() {
  // Contract address (deployments folder එකෙන් ගන්න)
  const contractAddress = "0xabcdef1234567890abcdef1234567890abcdef12";
  
  // Contract instance එක create කරනවා
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = Escrow.attach(contractAddress);
  
  // Accounts ගන්න
  const [client, freelancer, arbitrator] = await ethers.getSigners();
  
  console.log("📝 Testing Escrow Contract...");
  
  // 1. Escrow එකක් හදන්න
  console.log("1️⃣ Creating escrow...");
  const deadline = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const tx = await escrow.connect(client).createEscrow(
    freelancer.address,
    arbitrator.address,
    deadline,
    { value: ethers.parseEther("1.0") }
  );
  await tx.wait();
  console.log("✅ Escrow created!");
  
  // 2. Escrow ID එක ගන්න
  const escrowId = 1;
  
  // 3. Freelancer work complete කරනවා
  console.log("2️⃣ Completing milestone...");
  const tx2 = await escrow.connect(freelancer).completeMilestone(escrowId);
  await tx2.wait();
  console.log("✅ Milestone completed!");
  
  // 4. Client approve කරනවා
  console.log("3️⃣ Approving and releasing funds...");
  const tx3 = await escrow.connect(client).approveAndRelease(escrowId);
  await tx3.wait();
  console.log("✅ Funds released!");
  
  // 5. Check state
  const state = await escrow.getState(escrowId);
  console.log(`📊 Current state: ${state}`);
  
  // 6. Check freelancer balance
  const balance = await ethers.provider.getBalance(freelancer.address);
  console.log(`💰 Freelancer balance: ${ethers.formatEther(balance)} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});