const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test Suite untuk IkkyToken
 * 
 * BAB IV - Pengujian Smart Contract:
 * Test suite ini memverifikasi semua fungsionalitas kontrak IkkyToken,
 * termasuk skenario sebelum dan sesudah renounce ownership.
 */
describe("IkkyToken", function () {
    let token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const IkkyToken = await ethers.getContractFactory("IkkyToken");
        token = await IkkyToken.deploy(owner.address);
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Should have correct name and symbol", async function () {
            expect(await token.name()).to.equal("IkkyToken");
            expect(await token.symbol()).to.equal("KYT");
        });

        it("Should have ownershipRenounced as false initially", async function () {
            expect(await token.isOwnershipRenounced()).to.equal(false);
        });
    });

    describe("Minting (Sebelum Renounce)", function () {
        it("Owner should be able to mint tokens", async function () {
            const mintAmount = ethers.parseEther("1000");
            await token.mint(addr1.address, mintAmount);
            expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
        });

        it("Non-owner should NOT be able to mint", async function () {
            const mintAmount = ethers.parseEther("1000");
            await expect(
                token.connect(addr1).mint(addr1.address, mintAmount)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });

    describe("Pause (Sebelum Renounce)", function () {
        it("Owner should be able to pause", async function () {
            await token.pause();
            expect(await token.paused()).to.equal(true);
        });

        it("Owner should be able to unpause", async function () {
            await token.pause();
            await token.unpause();
            expect(await token.paused()).to.equal(false);
        });

        it("Transfer should fail when paused", async function () {
            await token.mint(owner.address, ethers.parseEther("1000"));
            await token.pause();
            await expect(
                token.transfer(addr1.address, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(token, "EnforcedPause");
        });
    });

    describe("Renounce Ownership Permanently", function () {
        it("Should successfully renounce ownership", async function () {
            await expect(token.renounceOwnershipPermanently())
                .to.emit(token, "OwnershipRenouncedPermanently")
                .withArgs(owner.address);

            expect(await token.owner()).to.equal(ethers.ZeroAddress);
            expect(await token.isOwnershipRenounced()).to.equal(true);
        });

        it("Should fail to renounce twice", async function () {
            await token.renounceOwnershipPermanently();
            // Sekarang owner adalah address(0), jadi onlyOwner akan fail
            await expect(
                token.renounceOwnershipPermanently()
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });

    describe("Fungsi Admin SETELAH Renounce (Bukti Desentralisasi)", function () {
        /**
         * BAB IV - Skenario Pengujian Utama:
         * Test-test berikut membuktikan bahwa setelah renounce,
         * TIDAK ADA PIHAK yang bisa melakukan aksi admin.
         */

        beforeEach(async function () {
            // Renounce ownership sebelum setiap test di grup ini
            await token.renounceOwnershipPermanently();
        });

        it("BUKTI: Mint harus GAGAL setelah renounce", async function () {
            await expect(
                token.mint(addr1.address, ethers.parseEther("1000"))
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("BUKTI: Pause harus GAGAL setelah renounce", async function () {
            await expect(
                token.pause()
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("BUKTI: Unpause harus GAGAL setelah renounce", async function () {
            await expect(
                token.unpause()
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("BUKTI: TransferOwnership harus GAGAL setelah renounce", async function () {
            await expect(
                token.transferOwnership(addr1.address)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("BUKTI: Bahkan previous owner tidak bisa mint", async function () {
            // Previous owner (yang sudah renounce) mencoba mint
            await expect(
                token.connect(owner).mint(addr1.address, ethers.parseEther("1000"))
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });

    describe("Transfer Token (Tetap Berfungsi Setelah Renounce)", function () {
        it("Token transfer should still work after renounce", async function () {
            // Mint sebelum renounce
            await token.mint(owner.address, ethers.parseEther("1000"));

            // Renounce
            await token.renounceOwnershipPermanently();

            // Transfer masih bisa dilakukan
            await token.transfer(addr1.address, ethers.parseEther("100"));
            expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
        });
    });

    describe("Blacklist & Unblacklist", function () {
        it("Owner should be able to blacklist an account", async function () {
            await expect(token.blacklist(addr1.address))
                .to.emit(token, "Blacklisted")
                .withArgs(addr1.address);
            expect(await token.isBlacklisted(addr1.address)).to.equal(true);
        });

        it("Owner should not be able to blacklist an already blacklisted account", async function () {
            await token.blacklist(addr1.address);
            await expect(token.blacklist(addr1.address))
                .to.be.revertedWith("IkkyToken: Account is already blacklisted");
        });

        it("Non-owner should not be able to blacklist", async function () {
            await expect(
                token.connect(addr1).blacklist(addr2.address)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("Owner should be able to unblacklist an account", async function () {
            await token.blacklist(addr1.address);
            await expect(token.unblacklist(addr1.address))
                .to.emit(token, "UnBlacklisted")
                .withArgs(addr1.address);
            expect(await token.isBlacklisted(addr1.address)).to.equal(false);
        });

        it("Owner should not be able to unblacklist an account that is not blacklisted", async function () {
            await expect(token.unblacklist(addr1.address))
                .to.be.revertedWith("IkkyToken: Account is not blacklisted");
        });

        it("Non-owner should not be able to unblacklist", async function () {
            await token.blacklist(addr1.address);
            await expect(
                token.connect(addr1).unblacklist(addr1.address)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });

    describe("Blacklist Transfer Restrictions", function () {
        beforeEach(async function () {
            await token.mint(owner.address, ethers.parseEther("1000"));
            await token.mint(addr1.address, ethers.parseEther("1000"));
        });

        it("Should prevent transfers from blacklisted sender", async function () {
            await token.blacklist(addr1.address);
            await expect(
                token.connect(addr1).transfer(addr2.address, ethers.parseEther("100"))
            ).to.be.revertedWith("IkkyToken: Sender is blacklisted");
        });

        it("Should prevent transfers to blacklisted receiver", async function () {
            await token.blacklist(addr2.address);
            await expect(
                token.transfer(addr2.address, ethers.parseEther("100"))
            ).to.be.revertedWith("IkkyToken: Receiver is blacklisted");
        });
    });

    describe("Standard renounceOwnership override", function () {
        it("Standard renounceOwnership should redirect to permanent renounce", async function () {
            await expect(token.renounceOwnership())
                .to.emit(token, "OwnershipRenouncedPermanently")
                .withArgs(owner.address);

            expect(await token.owner()).to.equal(ethers.ZeroAddress);
            expect(await token.isOwnershipRenounced()).to.equal(true);
        });
    });

    describe("transferOwnership", function () {
        it("Owner should be able to transfer ownership before renounce", async function () {
            await expect(token.transferOwnership(addr1.address))
                .to.emit(token, "OwnershipTransferred")
                .withArgs(owner.address, addr1.address);
            expect(await token.owner()).to.equal(addr1.address);
        });

        it("Non-owner should not be able to transfer ownership", async function () {
            await expect(
                token.connect(addr1).transferOwnership(addr2.address)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });
    });
});
