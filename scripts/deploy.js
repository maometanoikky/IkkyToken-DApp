const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying IkkyToken...\n");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deployer address:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Deployer balance:", hre.ethers.formatEther(balance), "ETH\n");

    // Deploy contract
    const IkkyToken = await hre.ethers.getContractFactory("IkkyToken");
    const token = await IkkyToken.deploy(deployer.address);

    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();

    console.log("✅ IkkyToken deployed to:", tokenAddress);
    console.log("👤 Initial owner:", await token.owner());

    // Mint initial supply (1,000,000 tokens)
    const initialSupply = hre.ethers.parseEther("1000000");
    console.log("\n🪙 Minting initial supply of 1,000,000 KYT...");

    const mintTx = await token.mint(deployer.address, initialSupply);
    await mintTx.wait();

    console.log("✅ Minted! Total supply:", hre.ethers.formatEther(await token.totalSupply()), "KYT");
    console.log("💎 Deployer balance:", hre.ethers.formatEther(await token.balanceOf(deployer.address)), "KYT");

    // Log contract info for frontend
    console.log("\n" + "=".repeat(50));
    console.log("📋 COPY THESE VALUES TO FRONTEND:");
    console.log("=".repeat(50));
    console.log(`CONTRACT_ADDRESS=${tokenAddress}`);
    console.log(`NETWORK=${hre.network.name}`);
    console.log("=".repeat(50));

    // Verify on Etherscan (if on Sepolia)
    if (hre.network.name === "sepolia") {
        console.log("\n⏳ Waiting for block confirmations before verification...");
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

        try {
            await hre.run("verify:verify", {
                address: tokenAddress,
                constructorArguments: [deployer.address],
            });
            console.log("✅ Contract verified on Etherscan!");
        } catch (error) {
            console.log("⚠️ Verification failed:", error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
