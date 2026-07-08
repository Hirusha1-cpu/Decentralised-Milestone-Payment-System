// scripts/deploy.ts - FIXED
import { ethers, network, run } from "hardhat";  // ← run එක import කරන්න!
import * as fs from "fs";
import * as path from "path";

async function main() {
    console.log("🚀 Deploying Escrow Contract...");
    // 1. Get the contract factory
    const Escrow = await ethers.getContractFactory("Escrow");
    // 2. Deploy the contract
    const escrow = await Escrow.deploy();
    // 3. Wait for deployment to be mined
    await escrow.waitForDeployment();
    // 4. Log the deployed contract address
    const address = await escrow.getAddress();
    console.log(`✅ Escrow deployed to: ${address}`);
    // 5. Save deployment info to a JSON file
    const deploymentInfo = {
        network: network.name,
        address: address,
        timestamp: new Date().toISOString(),
        chainId: network.config.chainId
    };
    // 6. Ensure the deployments directory exists
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    // 7. Write the deployment info to a JSON file
    fs.writeFileSync(
        path.join(deploymentsDir, `${network.name}.json`),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`✅ Deployment info saved to deployments/${network.name}.json`);
    // 8. Verify the contract on Etherscan if not on local networks
    if (network.name !== "hardhat" && network.name !== "localhost") {
        console.log("⏳ Waiting for Etherscan verification...");
        // Wait for a few blocks to ensure the contract is indexed by Etherscan
        await escrow.deploymentTransaction()?.wait(5);
        // 9. Verify the contract on Etherscan
        // ✅ Use 'run' instead of 'hre.run'
        await run("verify:verify", {
            address: address,
            constructorArguments: []
        });
        
        console.log("✅ Contract verified on Etherscan");
    }
}
// Run the main function and handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});