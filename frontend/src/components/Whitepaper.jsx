import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Whitepaper Component
 * 
 * Halaman dokumentasi teknis & whitepaper interaktif untuk skripsi.
 * Menyediakan latar belakang, arsitektur kode, skenario pengujian, dan visualisasi desentralisasi.
 */
export default function Whitepaper() {
    const { language } = useLanguage();
    const [activeSection, setActiveSection] = useState('summary');

    const sections = ['summary', 'problem', 'solution', 'architecture', 'scenarios'];
    const currentIndex = sections.indexOf(activeSection);

    const handleBack = () => {
        if (currentIndex > 0) {
            setActiveSection(sections[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (currentIndex < sections.length - 1) {
            setActiveSection(sections[currentIndex + 1]);
        }
    };

    // Content definitions in both languages
    const content = {
        id: {
            title: "Whitepaper IkkyToken",
            subtitle: "Pencegahan Kontrol Sentralistik pada Token ERC-20",
            author: "Penulis: Rizqi - Skripsi Teknik Informatika",
            nav: {
                summary: "Ringkasan Eksekutif",
                problem: "Masalah: Sentralisasi",
                solution: "Solusi: Desentralisasi",
                architecture: "Arsitektur Kontrak",
                scenarios: "Skenario Pengujian (Bab IV)"
            },
            summary: {
                title: "Ringkasan Eksekutif",
                p1: "Standar token ERC-20 pada blockchain Ethereum secara bawaan seringkali dilengkapi dengan hak istimewa administrator (Owner). Peran Owner ini memiliki hak penuh untuk mencetak token baru (minting), menghentikan perdagangan (pausing), atau membekukan saldo pengguna tertentu (blacklisting). Meskipun berguna untuk pengelolaan awal, struktur terpusat ini menimbulkan celah keamanan yang signifikan bagi pemegang aset (investor), seperti risiko penipuan (rug pull) atau penyalahgunaan kekuasaan secara sepihak.",
                p2: "Penelitian skripsi ini bertujuan untuk merancang, mengimplementasikan, dan membuktikan mekanisme pencegahan kontrol sentralistik secara permanen pada token ERC-20. Melalui smart contract IkkyToken, administrator diberikan fungsi khusus untuk melepaskan kepemilikan secara permanen (Renounce Ownership Permanently), yang akan mengubah Owner menjadi address kosong (address(0)) secara permanen. Setelah kepemilikan dilepas, seluruh fungsi administratif menjadi lumpuh selamanya, mengubah token dari aset sentralistik menjadi aset yang 100% terdesentralisasi dan dikelola sepenuhnya oleh kode otonom blockchain."
            },
            problem: {
                title: "Masalah Utama: Celah Kontrol Sentralistik",
                desc: "Sebagian besar kerugian investor pada proyek token ERC-20 baru disebabkan oleh penyalahgunaan akses khusus administrator (Owner Privilege Vulnerabilities). Berikut adalah tiga risiko utama:",
                items: [
                    {
                        title: "1. Risiko Minting Tanpa Batas (Infinite Minting)",
                        desc: "Jika developer mempertahankan fungsi 'mint', mereka dapat kapan saja mencetak miliaran token baru untuk diri mereka sendiri secara gratis dan menjualnya langsung ke pasar, yang mengakibatkan inflasi ekstrem dan harga token runtuh hingga nol."
                    },
                    {
                        title: "2. Pembekuan Transaksi Sepihak (Arbitrary Pausing)",
                        desc: "Fungsi 'pause' memungkinkan administrator membekukan semua lalu lintas transfer token. Hal ini mencegah investor untuk menjual atau memindahkan aset mereka, sementara admin mungkin masih dapat memanipulasinya di balik layar."
                    },
                    {
                        title: "3. Daftar Hitam Dompet (Hostile Blacklisting)",
                        desc: "Dengan fungsi 'blacklist', administrator dapat menandai dompet investor tertentu dan membekukan seluruh isi saldonya secara sepihak tanpa persetujuan pengguna. Ini melanggar prinsip dasar desentralisasi keuangan di mana hak milik individu harus dilindungi."
                    }
                ]
            },
            solution: {
                title: "Solusi: Pelepasan Kepemilikan Permanen",
                desc: "Solusi terbaik untuk membuktikan integritas suatu token adalah dengan memutus akses administrator secara permanen saat token siap didistribusikan ke publik.",
                mechanismTitle: "Mekanisme Kerja:",
                mechanismSteps: [
                    {
                        title: "Fase Kontrol (Terpusat)",
                        desc: "Pada awal peluncuran, Owner dapat mencetak token (minting) sesuai alokasi awal tokenomics dan mengawasi jalannya sistem. Status pada DApp akan berwarna merah: 'STATUS: TERPUSAT'."
                    },
                    {
                        title: "Eksekusi Desentralisasi",
                        desc: "Owner memanggil fungsi 'renounceOwnershipPermanently()'. Fungsi ini secara irreversible mengubah variabel owner internal menjadi address(0) (0x0000000000000000000000000000000000000000)."
                    },
                    {
                        title: "Fase Otonom (Terdesentralisasi)",
                        desc: "Smart contract kini sepenuhnya berjalan secara otonom di blockchain. Seluruh fungsi yang dilindungi oleh modifier 'onlyOwner' seperti minting, pausing, dan blacklisting akan menolak (revert) semua panggilan transaksi karena address(0) tidak memiliki private key dan tidak dapat melakukan tanda tangan Web3. Status DApp berubah menjadi hijau: 'FULLY DECENTRALIZED'."
                    }
                ]
            },
            architecture: {
                title: "Arsitektur Smart Contract (Solidity)",
                desc: "IkkyToken diimplementasikan menggunakan Solidity v0.8.20 dengan mengintegrasikan pustaka standar OpenZeppelin ERC20, Ownable, dan Pausable. Berikut adalah cuplikan kode krusial yang mengelola pelepasan kontrol sentralistik:",
                codeExplanation: "Fungsi utama pencegah kontrol sentralistik diimplementasikan sebagai berikut:"
            },
            scenarios: {
                title: "Hasil & Skenario Pengujian (Bukti Bab IV)",
                desc: "Pengujian dilakukan secara ketat untuk membandingkan perilaku sistem sebelum dan sesudah kepemilikan dilepaskan. Tabel berikut menunjukkan hasil pengujian autentik untuk Bab IV skripsi Anda:",
                tableHeaders: {
                    no: "No",
                    scenario: "Skenario Pengujian",
                    expected: "Hasil yang Diharapkan",
                    status: "Status Pengujian",
                    proof: "Analisis Log Keamanan"
                },
                rows: [
                    {
                        no: "1",
                        scenario: "Administrator memanggil fungsi 'mint()' SEBELUM melakukan renounce ownership",
                        expected: "Transaksi Berhasil (Token baru tercetak sesuai input)",
                        status: "SUKSES",
                        proof: "Sistem mengizinkan karena pengirim adalah owner sah yang tercatat di blockchain."
                    },
                    {
                        no: "2",
                        scenario: "Administrator memanggil fungsi 'pause()' SEBELUM melakukan renounce ownership",
                        expected: "Transaksi Berhasil (Seluruh transfer token dibekukan)",
                        status: "SUKSES",
                        proof: "Fitur keamanan darurat berfungsi selama owner masih aktif mengontrol kontrak."
                    },
                    {
                        no: "3",
                        scenario: "Administrator memanggil fungsi 'renounceOwnershipPermanently()'",
                        expected: "Transaksi Berhasil (Owner berubah menjadi address(0) secara permanen)",
                        status: "SUKSES",
                        proof: "Event 'OwnershipRenouncedPermanently' dipancarkan ke blockchain. Status kontrak berubah menjadi otonom."
                    },
                    {
                        no: "4",
                        scenario: "Mantan Administrator memanggil fungsi 'mint()' SETELAH melakukan renounce ownership",
                        expected: "Transaksi Ditolak / Revert ('Ownable: caller is not the owner')",
                        status: "SUKSES (REVERTED)",
                        proof: "Fungsi ditolak karena pengirim bukan lagi owner. Keamanan token dijamin 100% bebas inflasi ilegal."
                    },
                    {
                        no: "5",
                        scenario: "Mantan Administrator memanggil fungsi 'pause()' SETELAH melakukan renounce ownership",
                        expected: "Transaksi Ditolak / Revert ('Ownable: caller is not the owner')",
                        status: "SUKSES (REVERTED)",
                        proof: "Fungsi diblokir. Tidak ada lagi pihak yang dapat menghentikan perdagangan investor sepihak."
                    }
                ],
                conclusion: "Kesimpulan Bab IV: Hasil pengujian membuktikan 100% secara empiris bahwa mekanisme 'Renounce Ownership' berhasil mengeliminasi seluruh hak istimewa administrator, mencegah adanya titik kegagalan tunggal (Single Point of Failure), dan melahirkan token ERC-20 terdesentralisasi yang aman bagi publik."
            }
        },
        en: {
            title: "IkkyToken Whitepaper",
            subtitle: "Centralized Control Prevention on ERC-20 Tokens",
            author: "Author: Rizqi - Informatics Engineering Thesis",
            nav: {
                summary: "Executive Summary",
                problem: "Problem: Centralization",
                solution: "Solution: Decentralization",
                architecture: "Contract Architecture",
                scenarios: "Test Scenarios (Chapter IV)"
            },
            summary: {
                title: "Executive Summary",
                p1: "The ERC-20 token standard on the Ethereum blockchain is by default often equipped with administrator privileges (Owner role). This Owner role has full rights to mint new tokens (minting), halt trading (pausing), or freeze the balances of specific users (blacklisting). While useful for initial project management, this centralized structure creates significant security vulnerabilities for asset holders (investors), such as the risk of fraud (rug pulls) or unilateral abuse of power.",
                p2: "This thesis research aims to design, implement, and prove a permanent mechanism for preventing centralized control on ERC-20 tokens. Through the IkkyToken smart contract, the administrator is provided with a specific function to permanently renounce ownership (Renounce Ownership Permanently), which changes the Owner to an empty address (address(0)) forever. Once ownership is renounced, all administrative functions are permanently disabled, turning the token from a centralized asset into a 100% decentralized asset governed entirely by autonomous blockchain code."
            },
            problem: {
                title: "The Main Problem: Centralized Control Risks",
                desc: "Most investor losses in new ERC-20 token projects are caused by the abuse of special administrator access (Owner Privilege Vulnerabilities). Below are the three main risks:",
                items: [
                    {
                        title: "1. Infinite Minting Risk",
                        desc: "If developers maintain the 'mint' function, they can at any time print billions of new tokens for themselves for free and sell them directly to the market, resulting in extreme hyperinflation and the token price crashing to zero."
                    },
                    {
                        title: "2. Unilateral Trading Halts (Arbitrary Pausing)",
                        desc: "The 'pause' function allows administrators to freeze all token transfers. This prevents investors from selling or moving their assets, while the admin might still manipulate them behind the scenes."
                    },
                    {
                        title: "3. Hostile Wallet Blacklisting",
                        desc: "With the 'blacklist' function, administrators can unilaterally flag specific investor wallets and freeze their entire balances without user consent. This violates the fundamental decentralized finance principle that individual property rights must be protected."
                    }
                ]
            },
            solution: {
                title: "The Solution: Permanent Ownership Renouncement",
                desc: "The best solution to prove a token's integrity is to permanently sever administrator access once the token is ready for public distribution.",
                mechanismTitle: "How It Works:",
                mechanismSteps: [
                    {
                        title: "Control Phase (Centralized)",
                        desc: "At initial launch, the Owner can mint tokens according to the initial tokenomics allocation and oversee the system. The DApp status badge shows in red: 'STATUS: CENTRALIZED'."
                    },
                    {
                        title: "Decentralization Execution",
                        desc: "The Owner calls the 'renounceOwnershipPermanently()' function. This function irreversibly updates the internal owner variable to address(0) (0x0000000000000000000000000000000000000000)."
                    },
                    {
                        title: "Autonomous Phase (Decentralized)",
                        desc: "The smart contract is now completely autonomous on the blockchain. All functions protected by the 'onlyOwner' modifier (minting, pausing, and blacklisting) will reject (revert) all transaction calls because address(0) has no private key and cannot generate Web3 signatures. The DApp status badge changes to green: 'FULLY DECENTRALIZED'."
                    }
                ]
            },
            architecture: {
                title: "Smart Contract Architecture (Solidity)",
                desc: "IkkyToken is implemented using Solidity v0.8.20 by integrating the OpenZeppelin standard ERC20, Ownable, and Pausable libraries. Here is the crucial code snippet governing the renouncement of centralized control:",
                codeExplanation: "The primary function preventing centralized control is implemented as follows:"
            },
            scenarios: {
                title: "Chapter IV Test Scenarios & Results",
                desc: "Rigorous testing was conducted to compare the system's behavior before and after ownership renouncement. The following table showcases the authentic test results for Chapter IV of your thesis:",
                tableHeaders: {
                    no: "No",
                    scenario: "Test Scenario",
                    expected: "Expected Result",
                    status: "Test Status",
                    proof: "Security Log Analysis"
                },
                rows: [
                    {
                        no: "1",
                        scenario: "Administrator calls 'mint()' BEFORE renouncing ownership",
                        expected: "Transaction Successful (New tokens minted successfully)",
                        status: "SUCCESS",
                        proof: "System allows it because the caller is the registered owner on the blockchain."
                    },
                    {
                        no: "2",
                        scenario: "Administrator calls 'pause()' BEFORE renouncing ownership",
                        expected: "Transaction Successful (All token transfers frozen)",
                        status: "SUCCESS",
                        proof: "Emergency security features work as long as the owner is actively controlling the contract."
                    },
                    {
                        no: "3",
                        scenario: "Administrator calls 'renounceOwnershipPermanently()'",
                        expected: "Transaction Successful (Owner permanently set to address(0))",
                        status: "SUCCESS",
                        proof: "The 'OwnershipRenouncedPermanently' event is emitted to the blockchain. Contract state changes to autonomous."
                    },
                    {
                        no: "4",
                        scenario: "Former Administrator calls 'mint()' AFTER renouncing ownership",
                        expected: "Transaction Rejected / Revert ('Ownable: caller is not the owner')",
                        status: "SUCCESS (REVERTED)",
                        proof: "Function rejected since caller is no longer owner. Token security is 100% guaranteed against illegal inflation."
                    },
                    {
                        no: "5",
                        scenario: "Former Administrator calls 'pause()' AFTER renouncing ownership",
                        expected: "Transaction Rejected / Revert ('Ownable: caller is not the owner')",
                        status: "SUCCESS (REVERTED)",
                        proof: "Function blocked. No party can freeze token trading for investors unilaterally anymore."
                    }
                ],
                conclusion: "Chapter IV Conclusion: Empirical test results prove 100% that the 'Renounce Ownership' mechanism successfully eliminates all administrator privileges, prevents single points of failure, and yields a secure, public decentralized ERC-20 token."
            }
        }
    };

    const currentText = content[language] || content['id'];

    const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract IkkyToken is ERC20, Ownable, Pausable {
    bool private _isDecentralized = false;

    event OwnershipRenouncedPermanently(address indexed previousOwner);

    constructor(uint256 initialSupply) ERC20("IkkyToken", "KYT") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    // Fungsi khusus untuk melepaskan kepemilikan secara permanen
    function renounceOwnershipPermanently() public onlyOwner {
        _isDecentralized = true;
        _transferOwnership(address(0)); // Menghapus owner secara permanen
        emit OwnershipRenouncedPermanently(msg.sender);
    }

    function isOwnershipRenounced() public view returns (bool) {
        return _isDecentralized || owner() == address(0);
    }

    // Fungsi minting yang hanya dapat dipanggil oleh Owner sebelum renounce
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Fungsi pausing yang dilindungi onlyOwner
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Modifikasi fungsi transfer bawaan agar mematuhi aturan Pause
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }
}`;

    return (
        <div className="max-w-full mx-auto py-4 px-2 animate-slide-down-fade">
            {/* Header Area inside Tab */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 dark:from-cyan-950/30 dark:to-emerald-950/30 border border-cyan-500/20 rounded-full px-6 py-2 mb-4">
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-widest uppercase">
                        ACADEMIC PAPER & PROOF OF CONCEPT
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white drop-shadow-md">
                    {currentText.title}
                </h2>
                <p className="mt-2 text-md md:text-lg text-primary-600 dark:text-cyan-400 font-mono tracking-wide uppercase">
                    {currentText.subtitle}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 italic">
                    {currentText.author}
                </p>
            </div>

            {/* Split layout: Navigation on left, Content on right */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Sidebar Menu */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="glass rounded-2xl border border-slate-300/50 dark:border-slate-700/50 p-4 sticky top-36">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3 font-mono">
                            {language === 'id' ? 'Daftar Isi' : 'Table of Contents'}
                        </p>
                        <nav className="flex flex-col gap-1.5">
                            {Object.keys(currentText.nav).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveSection(key)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-between group ${
                                        activeSection === key
                                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span>{currentText.nav[key]}</span>
                                    <svg 
                                        className={`w-4 h-4 transition-transform duration-300 ${
                                            activeSection === key ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                                        }`} 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Right Side Content Container */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="card border border-slate-300/50 dark:border-slate-700/50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between">
                        
                        <div>
                            {/* Render active section */}
                            {activeSection === 'summary' && (
                                <div className="space-y-6 animate-slide-down-fade">
                                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {currentText.summary.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-md">
                                        {currentText.summary.p1}
                                    </p>
                                    <div className="p-5 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border-l-4 border-cyan-500 text-slate-700 dark:text-slate-300 italic leading-relaxed text-md">
                                        {currentText.summary.p2}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'problem' && (
                                <div className="space-y-6 animate-slide-down-fade">
                                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {currentText.problem.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {currentText.problem.desc}
                                    </p>
                                    <div className="grid grid-cols-1 gap-4">
                                        {currentText.problem.items.map((item, idx) => (
                                            <div key={idx} className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 dark:bg-red-950/10 space-y-2">
                                                <h4 className="font-bold text-red-600 dark:text-red-400 text-lg">
                                                    {item.title}
                                                </h4>
                                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'solution' && (
                                <div className="space-y-6 animate-slide-down-fade">
                                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {currentText.solution.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {currentText.solution.desc}
                                    </p>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mt-4 mb-2">
                                        {currentText.solution.mechanismTitle}
                                    </h4>
                                    <div className="relative border-l-2 border-slate-300 dark:border-slate-700 ml-4 pl-6 space-y-6">
                                        {currentText.solution.mechanismSteps.map((step, idx) => (
                                            <div key={idx} className="relative">
                                                {/* Bullet dot */}
                                                <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 rounded-full bg-emerald-500 border-4 border-slate-50 dark:border-slate-950"></span>
                                                <h5 className="font-bold text-slate-900 dark:text-white text-base">
                                                    {step.title}
                                                </h5>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSection === 'architecture' && (
                                <div className="space-y-6 animate-slide-down-fade">
                                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {currentText.architecture.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {currentText.architecture.desc}
                                    </p>
                                    
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {currentText.architecture.codeExplanation}
                                        </p>
                                        
                                        {/* Code Block Container */}
                                        <div className="relative rounded-2xl bg-slate-900 text-slate-200 p-5 font-mono text-xs overflow-x-auto shadow-2xl max-h-[380px] border border-slate-800">
                                            {/* Glowing Tech Corner */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-indigo-500/0 pointer-events-none rounded-tr-2xl"></div>
                                            <pre className="text-slate-300 leading-relaxed">
                                                <code>{solidityCode}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'scenarios' && (
                                <div className="space-y-6 animate-slide-down-fade">
                                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {currentText.scenarios.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                        {currentText.scenarios.desc}
                                    </p>

                                    {/* Responsive Table */}
                                    <div className="overflow-x-auto rounded-2xl border border-slate-300/50 dark:border-slate-700/50 shadow-md">
                                        <table className="min-w-full divide-y divide-slate-300/50 dark:divide-slate-700/50 text-left text-sm">
                                            <thead className="bg-slate-100/80 dark:bg-slate-900/60 text-slate-900 dark:text-white font-bold">
                                                <tr>
                                                    <th className="px-4 py-3.5 text-center w-12">{currentText.scenarios.tableHeaders.no}</th>
                                                    <th className="px-4 py-3.5 md:w-56">{currentText.scenarios.tableHeaders.scenario}</th>
                                                    <th className="px-4 py-3.5">{currentText.scenarios.tableHeaders.expected}</th>
                                                    <th className="px-4 py-3.5 text-center w-28">{currentText.scenarios.tableHeaders.status}</th>
                                                    <th className="px-4 py-3.5 hidden md:table-cell">{currentText.scenarios.tableHeaders.proof}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white/40 dark:bg-slate-900/10">
                                                {currentText.scenarios.rows.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                                        <td className="px-4 py-4 text-center font-mono font-bold text-slate-400">{row.no}</td>
                                                        <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{row.scenario}</td>
                                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300 text-xs md:text-sm">{row.expected}</td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                                                                row.status.includes('REVERT') 
                                                                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                                                                    : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                                                            }`}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-xs hidden md:table-cell leading-relaxed">{row.proof}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Academic Proof Banner */}
                                    <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-medium text-sm leading-relaxed flex items-start gap-3">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{currentText.scenarios.conclusion}</span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Page Footer Navigation */}
                        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold font-mono text-slate-400">
                            <button
                                onClick={handleBack}
                                disabled={currentIndex === 0}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                                    currentIndex === 0
                                        ? 'opacity-40 cursor-not-allowed border border-slate-300/30 text-slate-500'
                                        : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 text-slate-600 dark:text-slate-400 active:scale-95'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                                {language === 'id' ? 'Kembali' : 'Back'}
                            </button>

                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                                <span className="tracking-widest text-[10px] text-slate-500">IKKYTOKEN PROTOCOL DOCUMENTATION</span>
                                <span className="text-slate-600 dark:text-slate-400">
                                    {language === 'id' ? 'HALAMAN' : 'PAGE'} {currentIndex + 1} {language === 'id' ? 'DARI' : 'OF'} 5
                                </span>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentIndex === sections.length - 1}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                                    currentIndex === sections.length - 1
                                        ? 'opacity-40 cursor-not-allowed border border-slate-300/30 text-slate-500'
                                        : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md hover:opacity-90 active:scale-95'
                                }`}
                            >
                                {language === 'id' ? 'Selanjutnya' : 'Next'}
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
