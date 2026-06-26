# E. Evaluasi Sistem

Evaluasi sistem dilakukan untuk menguji kelayakan, keamanan, fungsionalitas, serta kinerja dari *Decentralized Application* (DApp) dan *smart contract* IkkyToken yang telah dibangun. Evaluasi ini dibagi menjadi tiga bagian pengujian utama, yaitu: Pengujian Fungsional (*Black Box Testing*), Pengujian Struktural (*White Box Testing*), dan Evaluasi Kinerja (*Performance Evaluation*).

---

## 1. Pengujian Fungsional (*Black Box Testing*)

Pengujian fungsional bertujuan untuk memastikan bahwa seluruh fitur antarmuka pengguna (DApp) dan kontrak pintar dapat beroperasi sesuai dengan skenario dan spesifikasi kebutuhan yang telah ditentukan, tanpa melihat detail kode program di dalamnya. Pengujian difokuskan pada interaksi pengguna melalui dompet MetaMask, pembatasan hak akses berbasis peran (*role-based access control*), serta pembuktian hilangnya kontrol sentralistik setelah fungsi pelepasan kepemilikan diaktifkan.

Hasil dari pengujian fungsional disajikan pada Tabel 1 berikut:

### Tabel 1. Hasil Pengujian Fungsional (*Black Box Testing*)

| ID | Fitur / Skenario Pengujian | Prosedur Pengujian (Input) | Hasil yang Diharapkan (Expected Output) | Kesimpulan |
| :--- | :--- | :--- | :--- | :---: |
| **BB-01** | Koneksi MetaMask (*Wallet Connection*) | Mengklik tombol "Connect Wallet" pada antarmuka DApp saat ekstensi MetaMask terpasang. | MetaMask menampilkan jendela pop-up permintaan koneksi. Setelah diklik setuju, alamat dompet pengguna dan saldo token (KYT) ditampilkan pada UI. | **Berhasil** |
| **BB-02** | Autentikasi Akses Admin (Owner) | Menghubungkan dompet MetaMask menggunakan alamat yang terdaftar sebagai owner kontrak pintar. | Aplikasi menampilkan menu khusus admin (*Admin Panel*) yang berisi form *minting*, tombol *pause/unpause*, dan form *blacklist*, serta tombol *Renounce Ownership*. | **Berhasil** |
| **BB-03** | Autentikasi Akses Non-Owner | Menghubungkan dompet MetaMask menggunakan alamat pengguna biasa (bukan owner). | *Admin Panel* dan tombol *Renounce Ownership* disembunyikan secara otomatis dari antarmuka pengguna biasa. | **Berhasil** |
| **BB-04** | Pencetakan Token (*Minting*) oleh Owner | Owner memasukkan alamat penerima yang valid dan jumlah token (misal: 1.000 KYT), lalu mengklik "Mint". | MetaMask meminta konfirmasi transaksi. Setelah disetujui, saldo alamat penerima bertambah sebanyak 1.000 KYT dan tercatat pada *Transaction Log*. | **Berhasil** |
| **BB-05** | Penghentian Transfer (*Pause*) oleh Owner | Owner mengklik tombol "Pause" pada Admin Panel. | Status token berubah menjadi **Paused** (Ditangguhkan) setelah konfirmasi transaksi. Seluruh form transfer dinonaktifkan di antarmuka pengguna. | **Berhasil** |
| **BB-06** | Pengaktifan Kembali Transfer (*Unpause*) | Owner mengklik tombol "Unpause" saat status token sedang *Paused*. | Status token kembali menjadi **Active** (Aktif) setelah transaksi berhasil dikonfirmasi. Pengguna biasa dapat melakukan transfer token kembali. | **Berhasil** |
| **BB-07** | Pembatasan Alamat (*Blacklist*) oleh Owner | Owner memasukkan alamat pengguna biasa ke kolom Blacklist dan mengklik "Add to Blacklist". | Alamat tersebut masuk ke dalam daftar hitam (*blacklist*), status terekam di sistem, dan alamat tersebut diblokir dari seluruh aktivitas pengiriman dan penerimaan token. | **Berhasil** |
| **BB-08** | Transfer Token oleh Pengguna Biasa | Pengguna biasa (non-blacklist) melakukan transfer token sebesar 100 KYT ke alamat pengguna lain. | Transaksi terkonfirmasi di MetaMask, saldo pengirim berkurang sebesar 100 KYT, dan saldo penerima bertambah secara *real-time*. | **Berhasil** |
| **BB-09** | Blokir Transfer Alamat Ter-blacklist | Alamat dompet yang terdaftar di dalam *blacklist* mencoba mengirimkan token ke alamat lain. | MetaMask langsung menampilkan pesan kegagalan transaksi (*transaction revert*) karena aturan *blacklist* aktif pada level kontrak pintar. | **Berhasil** |
| **BB-10** | **Pelepasan Kepemilikan (Renounce)** | Owner membuka menu pelepasan hak, mengetik frasa konfirmasi `"RENOUNCE"`, lalu mengklik tombol konfirmasi. | Transaksi ditandatangani. Setelah sukses, status DApp berubah menjadi **Decentralized**, alamat owner berubah menjadi alamat kosong (`0x0000...0000`), dan Admin Panel dikunci permanen. | **Berhasil** |
| **BB-11** | Blokir Fitur Admin Pasca-Renounce | Mantan owner mencoba memanggil fungsi admin (`mint`/`pause`) secara langsung ke kontrak pintar melalui konsol/explorer. | Transaksi ditolak langsung oleh EVM dengan pesan error `OwnableUnauthorizedAccount` karena tidak ada lagi owner yang terdaftar secara sah. | **Berhasil** |

---

## 2. Pengujian Struktural (*White Box Testing*)

Pengujian struktural bertujuan untuk memverifikasi logika kode internal, alur kendali (*control flow*), dan percabangan dalam kode program kontrak pintar `IkkyToken.sol`. Pengujian ini diimplementasikan menggunakan framework Hardhat, pustaka pengujian Mocha dan Chai, serta alat bantu `solidity-coverage` untuk mengukur persentase cakupan kode (*code coverage*).

Sebanyak 27 skenario uji unit (*unit testing*) telah dibuat untuk menguji seluruh fungsi dan kemungkinan skenario kegagalan, termasuk penolakan akses oleh modifier `onlyOwner` dan penanganan *require statement* dalam transaksi transfer. Seluruh 27 kasus uji dinyatakan **lulus (100% passing)**.

Hasil analisis cakupan kode pengujian struktural ditunjukkan pada Tabel 2 berikut:

### Tabel 2. Hasil Analisis Cakupan Kode (*Code Coverage*)

| Metrik Cakupan | Persentase | Keterangan |
| :--- | :---: | :--- |
| **Statement Coverage** | **100.00%** | Seluruh baris pernyataan dalam kode kontrak telah dieksekusi oleh pengujian. |
| **Function Coverage** | **100.00%** | Seluruh fungsi dalam kontrak pintar (baik publik maupun internal) telah diuji. |
| **Line Coverage** | **100.00%** | Seluruh baris kode yang menghasilkan instruksi operasional telah dieksekusi. |
| **Branch Coverage** | **89.29%** | Persentase percabangan kondisi logika yang dieksekusi oleh pengujian. |

### Analisis Keterbatasan Branch Coverage (89.29%)
Meskipun metrik *statement*, *function*, dan *line* mencapai nilai sempurna (100%), *branch coverage* berada pada batas maksimal sebesar **89.29%**. Hal ini disebabkan oleh adanya kode yang secara logis tidak dapat dicapai (*Unreachable Code*) pada percabangan kondisi berikut:
1.  Pengecekan percabangan `require(!_ownershipRenounced, ...)` di dalam fungsi `transferOwnership` saat kondisi `_ownershipRenounced` bernilai `true`.
2.  Pengecekan percabangan `require(!_ownershipRenounced, ...)` di dalam fungsi `renounceOwnershipPermanently` saat kondisi `_ownershipRenounced` bernilai `true`.

Kedua kondisi ini secara logis terhalang terlebih dahulu oleh modifier `onlyOwner` yang dipasang pada masing-masing tanda tangan fungsi. Ketika fungsi `renounceOwnershipPermanently` sukses dijalankan satu kali, variabel `_ownershipRenounced` diset ke `true`, dan status kepemilikan (`owner`) dipindahkan ke alamat kosong (`address(0)`). 

Karena modifier `onlyOwner` mengharuskan pengirim transaksi adalah pemilik kontrak yang sah (`msg.sender == owner()`), dan tidak ada pihak yang dapat menginisiasi transaksi atas nama `address(0)`, maka pemanggilan fungsi tersebut untuk kedua kalinya akan selalu menghasilkan *revert* akibat kegagalan modifier `onlyOwner` (mengembalikan error `OwnableUnauthorizedAccount`) sebelum sempat memverifikasi *require statement* di dalam badan fungsi. Hal ini membuktikan efektivitas pertahanan ganda yang menjamin kepemilikan kontrak tidak dapat direbut kembali setelah dilepas.

---

## 3. Evaluasi Kinerja (*Performance Evaluation*)

Evaluasi kinerja difokuskan pada aspek efisiensi operasional kontrak pintar pada mesin virtual Ethereum (EVM). Parameter kinerja utama diukur berdasarkan **konsumsi gas (*gas consumption*)** untuk setiap eksekusi fungsi utama di dalam kontrak `IkkyToken.sol`. 

Pengukuran gas dilakukan menggunakan modul `hardhat-gas-reporter`. Data konsumsi gas riil hasil pengujian disajikan pada Tabel 3 di bawah ini:

### Tabel 3. Hasil Pengukuran Konsumsi Gas (*Gas Consumption*)

| Fungsi / Operasi Smart Contract | Rata-rata Konsumsi Gas (Unit Gas) | Keterangan Kinerja |
| :--- | :---: | :--- |
| **Deployment Kontrak (IkkyToken)** | **947.657 gas** | Biaya inisialisasi awal satu kali untuk memuat kontrak ke jaringan blockchain. |
| **`mint`** | **70.434 gas** | Penambahan suplai token baru ke alamat tertentu (mengubah status penyimpanan/storage). |
| **`transfer`** | **58.252 gas** | Transaksi dasar pengiriman token antar dompet pengguna. |
| **`blacklist`** | **47.586 gas** | Operasi memasukkan alamat pengguna biasa ke daftar hitam (storage update). |
| **`unblacklist`** | **25.614 gas** | Operasi pemulihan status alamat dari daftar hitam (gas refund berlaku). |
| **`renounceOwnership` (standard)** | **29.846 gas** | Pemanggilan fungsi standard yang diarahkan ke fungsi permanen. |
| **`renounceOwnershipPermanently`** | **29.644 gas** | Fungsi inti pelepasan kepemilikan permanen (penulisan variabel flag). |
| **`transferOwnership`** | **29.039 gas** | Pengalihan kepemilikan ke alamat admin baru sebelum dilepas. |
| **`pause`** | **27.743 gas** | Mengubah status kontrak menjadi terkunci/pause. |
| **`unpause`** | **27.698 gas** | Mengembalikan status kontrak menjadi aktif/unpause. |

### Analisis Kinerja
1.  **Optimasi Ukuran bytecode**: 
    Smart contract `IkkyToken` dikompilasi dengan mengaktifkan fitur optimasi (*Solidity Optimizer*) dengan parameter `runs: 200`. Hal ini berhasil meminimalkan konsumsi gas deployment menjadi **947.657 gas**, yang hanya memakan sekitar **1,58%** dari batas limit gas per blok standar Ethereum (sebesar 60 juta gas). Ukuran bytecode yang dihasilkan jauh di bawah batas maksimum 24 KB yang ditetapkan oleh EIP-170, sehingga kontrak aman dideploy ke jaringan utama (*Mainnet*).
2.  **Efisiensi Gas Transaksi**: 
    Operasi penulisan memori baru seperti `mint` dan `blacklist` mengonsumsi gas lebih besar dibandingkan operasi modifikasi status seperti `pause`, `unpause`, dan `renounceOwnershipPermanently`. Operasi `unblacklist` menunjukkan efisiensi tinggi (hanya 25.614 gas) karena memicu pengembalian gas (*gas refund*) di EVM akibat pengosongan kunci penyimpanan data (*storage cleaning*).
3.  **Sifat Dinamis Biaya Riil**:
    Konsumsi gas di atas mewakili jumlah unit komputasi dasar (*Gas Used*) yang bernilai tetap. Namun, biaya transaksi riil dalam mata uang fiat (Rupiah/USD) akan bersifat dinamis tergantung pada fluktuasi harga gas jaringan (*Gas Price* dalam Gwei) dan nilai konversi Ether (ETH) saat transaksi dieksekusi di jaringan blockchain.
