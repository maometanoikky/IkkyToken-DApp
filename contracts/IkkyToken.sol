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
