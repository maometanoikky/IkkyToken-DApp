# LAMPIRAN

---

## LAMPIRAN A: Dokumentasi Antarmuka DApp (Screenshots)

*Berikut adalah tangkapan layar langkah-langkah penggunaan aplikasi IkkyToken (KYT) secara berurutan:*

1. **Halaman Koneksi MetaMask**
   *(Tempatkan screenshot halaman awal sebelum wallet MetaMask terhubung ke aplikasi)*
   
   > **Gambar A.1** Tampilan tombol "Connect Wallet" dan jendela pop-up konfirmasi MetaMask.

2. **Tampilan Panel Utama Admin (Owner)**
   *(Tempatkan screenshot ketika masuk menggunakan akun yang bertindak sebagai pemilik kontrak)*
   
   > **Gambar A.2** Menu dashboard admin khusus pemilik kontrak yang menyediakan opsi *Mint*, *Pause*, *Blacklist*, dan *Renounce*.

3. **Proses Pelepasan Kepemilikan (Renounce Ownership)**
   *(Tempatkan screenshot modal konfirmasi ketika mengetik kata "RENOUNCE")*
   
   > **Gambar A.3** Dialog verifikasi keamanan sebelum penandatanganan transaksi pelepasan hak pemilik.

4. **Tampilan DApp Setelah Desentralisasi (Pasca-Renounce)**
   *(Tempatkan screenshot ketika hak admin sudah terkunci secara permanen)*
   
   > **Gambar A.4** Status aplikasi berubah menjadi "Decentralized" dan seluruh fitur admin terkunci permanen.

---

## LAMPIRAN B: Log Hasil Pengujian Sistem (Technical Outputs)

### 1. Log Pengujian Unit (Hardhat Test Output)
```bash
  IkkyToken Contract
    Deployment
      ✔ Should set the right owner
      ✔ Should set owner-renounced flag to false initially
    Minting
      ✔ Should allow owner to mint tokens (70434 gas)
      ✔ Should fail minting if called by non-owner
    Pausable
      ✔ Should allow owner to pause transfers
      ✔ Should fail transfer when paused
    Blacklist
      ✔ Should allow owner to blacklist addresses
      ✔ Should revert transfer if sender is blacklisted
    Renounce Ownership
      ✔ Should allow owner to renounce ownership permanently
      ✔ Should block admin functions after renounce ownership

  27 passing (1.45s)
```

### 2. Log Cakupan Kode (Solidity Coverage Output)
```text
-------------------|----------|----------|----------|----------|----------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line |
-------------------|----------|----------|----------|----------|----------------|
 contracts/        |      100 |    89.29 |      100 |      100 |                |
  IkkyToken.sol    |      100 |    89.29 |      100 |      100 |                |
-------------------|----------|----------|----------|----------|----------------|
All files          |      100 |    89.29 |      100 |      100 |                |
-------------------|----------|----------|----------|----------|----------------|
```

---

## LAMPIRAN C: Kode Sumber Utama Smart Contract

*Berikut adalah kode sumber lengkap dari smart contract **IkkyToken.sol** yang digunakan dalam penelitian ini:*

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IkkyToken is ERC20, ERC20Pausable, Ownable {
    bool private _ownershipRenounced;
    mapping(address => bool) private _blacklisted;

    event Blacklisted(address indexed account);
    event UnBlacklisted(address indexed account);
    event OwnershipRenouncedPermanently(address indexed previousOwner);

    constructor(address initialOwner)
        ERC20("IkkyToken", "KYT")
        Ownable(initialOwner)
    {
        _ownershipRenounced = false;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // [Kode selengkapnya dapat dilihat pada berkas contracts/IkkyToken.sol]
}
```

---

## LAMPIRAN D: Dokumentasi Kegiatan / Pengujian Mandiri

*Berikut adalah bukti dokumentasi pengerjaan, deployment kontrak pintar ke testnet, serta pengujian mandiri di lingkungan lokal:*

1. **Deployment Kontrak Pintar ke Testnet/Lokal**
   *(Tempatkan screenshot log konsol terminal saat menjalankan perintah deploy)*
   
   > **Gambar D.1** Log terminal saat melakukan kompilasi dan deployment kontrak `IkkyToken` menggunakan Hardhat.

2. **Proses Debugging Antarmuka Frontend**
   *(Tempatkan screenshot lingkungan pengembangan Visual Studio Code / Browser Developer Tools)*
   
   > **Gambar D.2** Sesi pengerjaan integrasi RPC Provider dan penanganan error transaksi pada frontend.
