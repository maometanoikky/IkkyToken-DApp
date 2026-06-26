const hre = require("hardhat");

async function main() {
    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const balance = await hre.ethers.provider.getBalance(address);
    console.log("ETH Balance:", hre.ethers.formatEther(balance));

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const token = await hre.ethers.getContractAt("IkkyToken", contractAddress);
    const tokenBalance = await token.balanceOf(address);
    console.log("KYT Balance:", hre.ethers.formatEther(tokenBalance));
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
