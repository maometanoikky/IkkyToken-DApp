# BAB V
# KESIMPULAN DAN SARAN

## 5.1 Kesimpulan

Setelah melalui tahap perancangan, pembuatan, hingga uji coba pada aplikasi desentralisasi (DApp) dan kontrak pintar (*smart contract*) IkkyToken (KYT), berikut adalah beberapa kesimpulan penting yang didapatkan:

1. **Sistem Desentralisasi Berhasil Diterapkan:**
   Fitur lepas kepemilikan (*renounce ownership*) lewat fungsi `renounceOwnershipPermanently` sudah berjalan dengan sangat baik berkat sistem pengaman ganda (*double security flag*). Uji coba fungsional (*Black Box Testing*) membuktikan bahwa begitu pemilik melepaskan haknya, status kontrak pintar langsung berubah menjadi desentralisasi penuh secara permanen. Mantan pemilik sama sekali tidak bisa lagi mengakses panel admin ataupun menggunakan fitur penting seperti cetak token (*minting*), menghentikan sementara transfer (*pause*), dan memblokir alamat (*blacklist*).

2. **Kode Program Aman dan Teruji (*White Box Testing*):**
   Semua skenario pengujian (27 kasus uji unit) berhasil lulus 100% menggunakan alat bantu Hardhat, Mocha, dan Chai. Cakupan kodenya pun luar biasa karena *Statement*, *Function*, dan *Line Coverage* semuanya mencapai 100%. Untuk *Branch Coverage* yang berada di angka 89.29%, hal ini disebabkan oleh sistem keamanan ganda yang sengaja memblokir kode tertentu agar tidak bisa dijalankan kembali setelah kepemilikan dilepas. Jadi, sisa persentase tersebut bukan karena adanya error (*bug*), melainkan bukti bahwa sistem pengamanannya bekerja dengan benar.

3. **Kinerja Cepat dan Hemat Biaya Gas:**
   Penggunaan gas pada kontrak pintar IkkyToken (KYT) sangat efisien karena fitur *Solidity Optimizer* diaktifkan saat kompilasi. Biaya awal untuk memasang kontrak (*deployment*) hanya sebesar 947.657 gas (sekitar 1,58% dari batas maksimal jaringan Ethereum), dengan ukuran file yang ringkas. Biaya transaksi harian seperti transfer token (58.252 gas) dan memblokir alamat (47.586 gas) juga tergolong murah. Bahkan, proses menghapus alamat dari daftar hitam (*unblacklist*) hanya memakan 25.614 gas karena sistem otomatis mendapat kembalian gas (*gas refund*) dari EVM setelah menghapus data yang tidak terpakai.

4. **Aplikasi Antarmuka (DApp) Berfungsi dengan Baik:**
   Tampilan aplikasi (*frontend*) dapat terhubung ke dompet MetaMask secara langsung dan lancar. Halaman admin akan otomatis disembunyikan dari pengguna biasa dan hanya muncul jika pemilik yang sah masuk. Aplikasi juga mampu menampilkan pesan error yang jelas jika transaksi gagal atau ketika transfer token sedang dihentikan sementara (*paused*).

---

## 5.2 Saran

Berdasarkan hasil uji coba dan keterbatasan sistem yang ditemukan selama pengembangan, ada beberapa rekomendasi penting yang dapat diterapkan untuk pengembangan atau penelitian lebih lanjut. 

Pertama, dari sisi tata kelola token, sangat disarankan untuk mengalihkan hak kontrol administratif secara bertahap sebelum melakukan pelepasan kepemilikan (*renounce ownership*) secara permanen. Hal ini dapat dicapai dengan mengintegrasikan dompet bersama (*multi-signature wallet* seperti Gnosis Safe) atau menggunakan kontrak tata kelola komunitas (*Decentralized Autonomous Organization* / DAO). Melalui skema ini, tindakan darurat seperti menghentikan sementara transfer token ketika terjadi insiden keamanan masih dapat dilakukan berdasarkan keputusan bersama, alih-alih mengunci kendali sepenuhnya sejak awal tanpa kemungkinan untuk dipulihkan jika terjadi masalah di masa depan.

Kedua, untuk mengatasi tingginya biaya transaksi riil (*gas fee*) bagi pengguna biasa akibat fluktuasi harga di jaringan utama Ethereum, implementasi aplikasi di masa mendatang sebaiknya diarahkan ke solusi solusi penskalaan Layer-2 (seperti Arbitrum, Optimism, atau Polygon). Transisi ke jaringan Layer-2 akan memotong biaya transaksi secara drastis dengan pemrosesan yang jauh lebih cepat, namun tetap mempertahankan aspek keamanan dari jaringan dasar Ethereum. Selain itu, untuk mengantisipasi kebutuhan perbaikan bug atau penambahan fitur di masa depan tanpa harus membuat token baru dari nol, penggunaan pola arsitektur kontrak pintar yang bisa diperbarui (*Upgradeable Smart Contract* seperti standar UUPS) sangat direkomendasikan untuk diterapkan dengan pengawasan ketat dari komunitas atau menggunakan mekanisme *timelock*.

Terakhir, dari sisi antarmuka pengguna (DApp frontend), disarankan untuk menambahkan fitur penaksir biaya transaksi (*gas estimator*) yang mampu mengonversi perkiraan biaya gas secara langsung ke dalam mata uang fiat rupiah secara *real-time*. Peningkatan ini akan memberikan transparansi biaya dan kenyamanan yang lebih baik bagi pengguna awam saat berinteraksi dengan MetaMask, serta membantu mereka menghindari kegagalan transaksi akibat biaya gas yang tidak terduga saat jaringan blockchain sedang padat.
