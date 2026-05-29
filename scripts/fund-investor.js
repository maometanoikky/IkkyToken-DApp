const hre = require("hardhat");

async function main() {
    // Ambil alamat investor dari argument command line
    const investorAddress = process.argv[2];
    if (!investorAddress) {
        console.error("❌ Mohon masukkan alamat wallet investor! Contoh: npx hardhat run scripts/fund-investor.js --network localhost 0x...");
        process.exit(1);
    }

    console.log(`🚀 Memulai transfer dana ke Investor: ${investorAddress}\n`);

    const [admin] = await hre.ethers.getSigners();
    
    // 1. Kirim 10 ETH Lokal untuk biaya gas
    const ethAmount = hre.ethers.parseEther("10");
    const tx = await admin.sendTransaction({
        to: investorAddress,
        value: ethAmount
    });
    await tx.wait();
    console.log(`✅ Sukses mengirim 10 ETH Lokal (untuk Gas Fees)!`);

    // 2. Mint 10,000 KYT Token ke Investor
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const IkkyToken = await hre.ethers.getContractAt("IkkyToken", contractAddress);
    
    const kytAmount = hre.ethers.parseEther("10000");
    const mintTx = await IkkyToken.mint(investorAddress, kytAmount);
    await mintTx.wait();
    console.log(`✅ Sukses melakukan minting 10,000 KYT Token ke Investor!`);

    console.log("\n💎 Selesai! Dompet Investor di HP Anda sekarang siap 100% untuk bertransaksi.");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
