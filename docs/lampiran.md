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
  IkkyToken
    Deployment
      ✔ Should set the right owner (106ms)
      ✔ Should have correct name and symbol
      ✔ Should have ownershipRenounced as false initially
    Minting (Sebelum Renounce)
      ✔ Owner should be able to mint tokens
      ✔ Non-owner should NOT be able to mint (60ms)
    Pause (Sebelum Renounce)
      ✔ Owner should be able to pause
      ✔ Owner should be able to unpause
      ✔ Transfer should fail when paused
    Renounce Ownership Permanently
      ✔ Should successfully renounce ownership
      ✔ Should fail to renounce twice
    Fungsi Admin SETELAH Renounce (Bukti Desentralisasi)
      ✔ BUKTI: Mint harus GAGAL setelah renounce
      ✔ BUKTI: Pause harus GAGAL setelah renounce
      ✔ BUKTI: Unpause harus GAGAL setelah renounce
      ✔ BUKTI: TransferOwnership harus GAGAL setelah renounce
      ✔ BUKTI: Bahkan previous owner tidak bisa mint
    Transfer Token (Tetap Berfungsi Setelah Renounce)
      ✔ Token transfer should still work after renounce
    Blacklist & Unblacklist
      ✔ Owner should be able to blacklist an account
      ✔ Owner should not be able to blacklist an already blacklisted account
      ✔ Non-owner should not be able to blacklist
      ✔ Owner should be able to unblacklist an account (56ms)
      ✔ Owner should not be able to unblacklist an account that is not blacklisted
      ✔ Non-owner should not be able to unblacklist
    Blacklist Transfer Restrictions
      ✔ Should prevent transfers from blacklisted sender
      ✔ Should prevent transfers to blacklisted receiver
    Standard renounceOwnership override
      ✔ Standard renounceOwnership should redirect to permanent renounce
    transferOwnership
      ✔ Owner should be able to transfer ownership before renounce
      ✔ Non-owner should not be able to transfer ownership

  27 passing (3s)
```

### 2. Log Cakupan Kode (Solidity Coverage Output)
```text
----------------|----------|----------|----------|----------|----------------|
File            |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------|----------|----------|----------|----------|----------------|
 contracts\     |      100 |    89.29 |      100 |      100 |                |
  IkkyToken.sol |      100 |    89.29 |      100 |      100 |                |
----------------|----------|----------|----------|----------|----------------|
All files       |      100 |    89.29 |      100 |      100 |                |
----------------|----------|----------|----------|----------|----------------|
```

---

## LAMPIRAN C: Kode Sumber Utama Smart Contract

*Berikut adalah kode sumber lengkap dari smart contract **IkkyToken.sol** yang digunakan dalam penelitian ini:*

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IkkyToken (KYT)
 * @author Rizqi - Skripsi Informatika
 * @notice Smart Contract ERC-20 dengan mekanisme pencegahan kontrol sentralistik
 * @dev Kontrak ini mengimplementasikan token ERC-20 dengan fitur:
 *      - Minting oleh owner
 *      - Pause/Unpause oleh owner
 *      - Renounce ownership secara permanen
 * 
 * BAB IV - Implementasi:
 * Kontrak ini menggunakan library OpenZeppelin untuk memastikan keamanan dan
 * standar yang sudah teruji. Fitur utama adalah kemampuan untuk melepaskan
 * kepemilikan secara permanen sehingga tidak ada pihak yang dapat mengontrol
 * token secara terpusat setelahnya.
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IkkyToken is ERC20, ERC20Pausable, Ownable {
    
    /**
     * @notice Flag untuk menandai apakah kepemilikan sudah dilepaskan secara permanen
     * @dev Setelah true, tidak ada cara untuk mengubahnya kembali ke false
     * 
     * BAB IV - Variabel State:
     * Variabel ini berfungsi sebagai pengaman ganda untuk memastikan bahwa
     * setelah renounce, ownership benar-benar tidak bisa diklaim kembali.
     */
    bool private _ownershipRenounced;

    /**
     * @notice Mapping untuk menyimpan daftar alamat yang di-blacklist
     * 
     * BAB IV - Variabel State (Blacklisting):
     * Mencegah alamat tertentu untuk mengirim atau menerima token.
     */
    mapping(address => bool) private _blacklisted;

    /**
     * @notice Event yang dipancarkan saat alamat dimasukkan ke blacklist
     */
    event Blacklisted(address indexed account);

    /**
     * @notice Event yang dipancarkan saat alamat dikeluarkan dari blacklist
     */
    event UnBlacklisted(address indexed account);

    /**
     * @notice Event yang dipancarkan ketika kepemilikan dilepaskan secara permanen
     * @param previousOwner Alamat owner sebelumnya
     * 
     * BAB IV - Event:
     * Event ini akan tercatat di blockchain dan dapat digunakan sebagai bukti
     * bahwa desentralisasi telah terjadi.
     */
    event OwnershipRenouncedPermanently(address indexed previousOwner);

    /**
     * @notice Konstruktor untuk inisialisasi token
     * @param initialOwner Alamat yang akan menjadi owner pertama
     * 
     * BAB IV - Konstruktor:
     * Konstruktor menginisialisasi token dengan nama "IkkyToken" dan simbol "KYT".
     * Initial owner ditetapkan melalui parameter untuk fleksibilitas deployment.
     */
    constructor(address initialOwner)
        ERC20("IkkyToken", "KYT")
        Ownable(initialOwner)
    {
        _ownershipRenounced = false;
    }

    /**
     * @notice Fungsi untuk minting token baru
     * @param to Alamat penerima token
     * @param amount Jumlah token yang akan di-mint (dalam wei, 18 desimal)
     * 
     * BAB IV - Fungsi Mint:
     * Fungsi ini hanya dapat dipanggil oleh owner. Setelah ownership di-renounce,
     * fungsi ini akan gagal (revert) karena tidak ada lagi owner yang valid.
     * Ini membuktikan bahwa supply tidak bisa ditambah secara sewenang-wenang
     * setelah desentralisasi.
     * 
     * @dev Menggunakan modifier onlyOwner dari Ownable
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Fungsi untuk mem-pause semua transfer token
     * 
     * BAB IV - Fungsi Pause:
     * Fungsi ini memungkinkan owner untuk menghentikan sementara semua transfer.
     * Berguna untuk situasi darurat. Setelah ownership di-renounce, fungsi ini
     * tidak bisa dipanggil lagi, memastikan token tidak bisa di-freeze oleh siapapun.
     * 
     * @dev Menggunakan modifier onlyOwner dari Ownable
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice Fungsi untuk meng-unpause transfer token
     * 
     * BAB IV - Fungsi Unpause:
     * Kebalikan dari pause(), fungsi ini mengaktifkan kembali kemampuan transfer.
     * Sama seperti pause(), hanya owner yang bisa memanggil dan tidak akan berfungsi
     * setelah renounce.
     * 
     * @dev Menggunakan modifier onlyOwner dari Ownable
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @notice Fungsi untuk memasukkan alamat ke dalam blacklist
     * @param account Alamat yang akan di-blacklist
     * 
     * BAB IV - Fungsi Blacklist:
     * Fungsi ini mencegah alamat tertentu untuk melakukan transfer token.
     * Setelah ownership di-renounce, fungsi ini tidak bisa digunakan lagi.
     * 
     * @dev Menggunakan modifier onlyOwner
     */
    function blacklist(address account) public onlyOwner {
        require(!_blacklisted[account], "IkkyToken: Account is already blacklisted");
        _blacklisted[account] = true;
        emit Blacklisted(account);
    }

    /**
     * @notice Fungsi untuk mengeluarkan alamat dari blacklist
     * @param account Alamat yang akan di-unblacklist
     * 
     * @dev Menggunakan modifier onlyOwner
     */
    function unblacklist(address account) public onlyOwner {
        require(_blacklisted[account], "IkkyToken: Account is not blacklisted");
        _blacklisted[account] = false;
        emit UnBlacklisted(account);
    }

    /**
     * @notice Fungsi untuk mengecek apakah suatu alamat masuk blacklist
     * @param account Alamat yang dicek
     * @return bool True jika di-blacklist, false jika tidak
     */
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklisted[account];
    }

    /**
     * @notice Fungsi untuk melepaskan kepemilikan secara PERMANEN
     * 
     * BAB IV - Fungsi Inti Desentralisasi:
     * Ini adalah fungsi utama yang membuktikan mekanisme pencegahan kontrol sentralistik.
     * Setelah dipanggil:
     * 1. Owner diubah ke address(0) - alamat yang tidak bisa diakses siapapun
     * 2. Flag _ownershipRenounced diset ke true
     * 3. Semua fungsi admin (mint, pause, unpause) akan GAGAL selamanya
     * 
     * PERINGATAN: Aksi ini TIDAK BISA DIBATALKAN!
     * 
     * @dev Override dari Ownable.renounceOwnership() dengan penambahan flag permanen
     */
    function renounceOwnershipPermanently() public onlyOwner {
        require(!_ownershipRenounced, "IkkyToken: Ownership already renounced");
        
        address previousOwner = owner();
        _ownershipRenounced = true;
        
        // Memanggil fungsi internal untuk transfer ke address(0)
        _transferOwnership(address(0));
        
        emit OwnershipRenouncedPermanently(previousOwner);
    }

    /**
     * @notice Override untuk mencegah transfer ownership setelah renounce
     * @param newOwner Alamat owner baru (akan gagal jika dipanggil setelah renounce)
     * 
     * BAB IV - Pencegahan Transfer Ownership:
     * Fungsi ini di-override untuk menambahkan pengecekan flag _ownershipRenounced.
     * Meskipun secara teori owner adalah address(0) setelah renounce, override ini
     * menambahkan lapisan keamanan ekstra.
     * 
     * @dev Menambahkan require check sebelum memanggil parent function
     */
    function transferOwnership(address newOwner) public override onlyOwner {
        require(!_ownershipRenounced, "IkkyToken: Cannot transfer, ownership permanently renounced");
        super.transferOwnership(newOwner);
    }

    /**
     * @notice Override renounceOwnership standar untuk mengarahkan ke fungsi permanen
     * 
     * BAB IV - Konsistensi API:
     * Fungsi renounceOwnership() standar dari Ownable di-override untuk mengarahkan
     * ke renounceOwnershipPermanently(). Ini memastikan bahwa cara apapun untuk
     * melepas ownership akan menghasilkan hasil yang sama - permanen.
     * 
     * @dev Memanggil renounceOwnershipPermanently() untuk konsistensi
     */
    function renounceOwnership() public override onlyOwner {
        renounceOwnershipPermanently();
    }

    /**
     * @notice Fungsi untuk mengecek apakah ownership sudah di-renounce permanen
     * @return bool True jika sudah di-renounce, false jika belum
     * 
     * BAB IV - Fungsi View:
     * Fungsi publik ini memungkinkan siapapun untuk memverifikasi status
     * desentralisasi kontrak. Penting untuk transparansi.
     */
    function isOwnershipRenounced() public view returns (bool) {
        return _ownershipRenounced;
    }

    /**
     * @notice Override internal function untuk pausable functionality
     * @param from Alamat pengirim
     * @param to Alamat penerima
     * @param value Jumlah token
     * 
     * BAB IV - Hook Internal:
     * Fungsi _update() adalah hook yang dipanggil pada setiap transfer.
     * Override ini diperlukan karena ERC20 dan ERC20Pausable keduanya
     * mengimplementasikan fungsi ini (diamond inheritance).
     * 
     * @dev Required override karena multiple inheritance
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        require(!_blacklisted[from], "IkkyToken: Sender is blacklisted");
        require(!_blacklisted[to], "IkkyToken: Receiver is blacklisted");
        super._update(from, to, value);
    }
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
