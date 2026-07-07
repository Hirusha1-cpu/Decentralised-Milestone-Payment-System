// scripts/deploy.ts - FIXED
import { ethers, network, run } from "hardhat";  // ← run එක import කරන්න!
import * as fs from "fs";
import * as path from "path";

async function main() {
    console.log("🚀 Deploying Escrow Contract...");

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy();

    await escrow.waitForDeployment();

    const address = await escrow.getAddress();
    console.log(`✅ Escrow deployed to: ${address}`);

    const deploymentInfo = {
        network: network.name,
        address: address,
        timestamp: new Date().toISOString(),
        chainId: network.config.chainId
    };

    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(deploymentsDir, `${network.name}.json`),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log(`✅ Deployment info saved to deployments/${network.name}.json`);

    if (network.name !== "hardhat" && network.name !== "localhost") {
        console.log("⏳ Waiting for Etherscan verification...");
        await escrow.deploymentTransaction()?.wait(5);
        
        // ✅ Use 'run' instead of 'hre.run'
        await run("verify:verify", {
            address: address,
            constructorArguments: []
        });
        
        console.log("✅ Contract verified on Etherscan");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});