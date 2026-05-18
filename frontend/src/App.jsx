import { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { Toaster, toast } from 'react-hot-toast';

// Components
import ConnectWallet from './components/ConnectWallet';
import OwnershipDashboard from './components/OwnershipDashboard';
import AdminPanel from './components/AdminPanel';
import RenounceOwnership from './components/RenounceOwnership';
import TransactionLog from './components/TransactionLog';
import TransferToken from './components/TransferToken';
import TokenomicsChart from './components/TokenomicsChart';
import ThemeToggle from './components/ThemeToggle';

// Config
import { IKKYTOKEN_ABI, CONTRACT_ADDRESS } from './config/contract';

/**
 * Main App Component
 * 
 * DApp utama untuk berinteraksi dengan smart contract IkkyToken.
 * Fitur:
 * - Connect MetaMask wallet
 * - Dashboard status kepemilikan
 * - Admin panel untuk mint & pause
 * - Renounce ownership permanently
 * - Transaction log untuk bukti pengujian
 */
function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState('');
    const [isRenounced, setIsRenounced] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [transactions, setTransactions] = useState([]);

    // Initialize contract when signer changes
    useEffect(() => {
        if (signer && CONTRACT_ADDRESS !== 'YOUR_CONTRACT_ADDRESS_HERE') {
            const tokenContract = new Contract(CONTRACT_ADDRESS, IKKYTOKEN_ABI, signer);
            setContract(tokenContract);
        }
    }, [signer, CONTRACT_ADDRESS]);

    // Fetch contract state when contract changes
    useEffect(() => {
        if (contract) {
            fetchContractState();
        }
    }, [contract]);

    const fetchContractState = async () => {
        try {
            const [owner, renounced, paused] = await Promise.all([
                contract.owner(),
                contract.isOwnershipRenounced(),
                contract.paused()
            ]);
            setOwnerAddress(owner);
            setIsRenounced(renounced);
            setIsPaused(paused);
        } catch (error) {
            console.error('Error fetching contract state:', error);
        }
    };

    const handleTransaction = (tx) => {
        setTransactions(prev => [tx, ...prev]);

        // Show toast notification
        if (tx.status === 'success') {
            toast.success(tx.message, { duration: 5000 });
            // Refresh contract state after successful transaction
            setTimeout(fetchContractState, 1000);
        } else if (tx.status === 'error') {
            toast.error(tx.message, { duration: 5000 });
        } else if (tx.status === 'pending') {
            toast.loading(tx.message, { id: tx.type });
        }
    };

    const isOwner = account && ownerAddress && account.toLowerCase() === ownerAddress.toLowerCase();
    const isContractConfigured = CONTRACT_ADDRESS !== 'YOUR_CONTRACT_ADDRESS_HERE';

    return (
        <div className="min-h-screen pb-10 bg-slate-50 dark:bg-slate-950 relative overflow-hidden z-0 transition-colors duration-300">
            {/* Ambient Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px]"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px]"></div>
                <div className="absolute top-[30%] left-[50%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]"></div>
                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0f172a',
                        color: '#e2e8f0',
                        border: '1px solid #1e293b'
                    }
                }}
            />

            {/* Global Pause Banner */}
            {isPaused && account && (
                <div className="bg-red-600 border-b border-red-500 text-white px-4 py-3 text-center sticky top-0 z-50 animate-pulse-slow">
                    <p className="font-bold flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        ⚠️ PERHATIAN: SELURUH TRANSAKSI TOKEN SAAT INI SEDANG DIBEKUKAN OLEH ADMIN ⚠️
                    </p>
                </div>
            )}

            {/* Premium Floating Header */}
            <div className={`px-4 pt-6 sticky ${isPaused && account ? 'top-12' : 'top-0'} z-40`}>
                <header className="max-w-6xl mx-auto glass rounded-2xl border border-slate-300/50 dark:border-slate-700/50 shadow-xl transition-colors duration-300">
                    <div className="px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* Simple & Bold Custom Logo */}
                            <div className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
                                <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="logo-gradient-bold" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#0ea5e9" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                        <filter id="logo-glow-bold">
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    <g filter="url(#logo-glow-bold)">
                                        <path d="M20 3L35 11.5V28.5L20 37L5 28.5V11.5L20 3Z" stroke="url(#logo-gradient-bold)" strokeWidth="2.5" fill="none" />
                                        <path d="M20 10L29 15.5V25.5L20 31L11 25.5V15.5L20 10Z" stroke="url(#logo-gradient-bold)" strokeWidth="2" fill="none" />
                                        <circle cx="20" cy="20.5" r="3.5" fill="url(#logo-gradient-bold)" />
                                        <path d="M20 3L20 10 M35 11.5L29 15.5 M35 28.5L29 25.5 M20 37L20 31 M5 28.5L11 25.5 M5 11.5L11 15.5" stroke="url(#logo-gradient-bold)" strokeWidth="1.5" fill="none" />
                                    </g>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide drop-shadow-md">IkkyToken</h1>
                                <p className="text-xs text-primary-600 dark:text-cyan-400 font-mono tracking-widest uppercase">Decentralized Asset</p>
                            </div>
                        </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <ConnectWallet
                            account={account}
                            setAccount={setAccount}
                            setSigner={setSigner}
                            setProvider={setProvider}
                        />
                    </div>
                    </div>
                </header>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {!account ? (
                    /* Not Connected State */
                    <div className="py-12 animate-slide-down-fade">
                        {/* Welcome Header */}
                        <div className="text-center mb-16">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center glow">
                                <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Selamat Datang di IkkyToken DApp</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg mb-8">
                                Aplikasi Web3 terdesentralisasi untuk demonstrasi pencegahan kontrol sentralistik pada token ERC-20.
                            </p>
                            <div className="inline-block bg-white/50 dark:bg-slate-800/50 border border-primary-500/30 rounded-full px-6 py-3 animate-pulse">
                                <p className="text-primary-400 font-medium flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                    Silakan hubungkan wallet MetaMask di pojok kanan atas
                                </p>
                            </div>
                        </div>

                        {/* Educational Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Card 1 */}
                            <div className="card hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-blue-500 bg-white/80 dark:bg-slate-900/80 text-center">
                                <div className="w-12 h-12 mx-auto rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Apa itu Crypto & Web3?</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Cryptocurrency adalah aset digital yang dijamin oleh kriptografi. Web3 adalah generasi internet baru yang terdesentralisasi, di mana pengguna memiliki kendali penuh atas aset dan data mereka tanpa dikontrol oleh perantara bank atau institusi sentral.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="card hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-purple-500 bg-white/80 dark:bg-slate-900/80 text-center">
                                <div className="w-12 h-12 mx-auto rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Standar Token ERC-20</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    ERC-20 adalah standar teknis yang digunakan untuk <i>smart contract</i> di blockchain Ethereum. Standar ini memastikan semua token memiliki fungsi dasar yang seragam (seperti transfer token dan cek saldo), sehingga dapat berinteraksi dengan berbagai wallet dan exchange di seluruh dunia.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="card hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-green-500 bg-white/80 dark:bg-slate-900/80 text-center">
                                <div className="w-12 h-12 mx-auto rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fokus Skripsi</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    DApp ini mendemonstrasikan pentingnya <strong>Desentralisasi Penuh</strong>. Melalui fitur <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-green-600 dark:text-green-400">Renounce Ownership</code>, <strong>developer</strong> dapat menghilangkan fungsi-fungsi kritis yang mereka miliki secara permanen (seperti fungsi <span className="text-primary-600 dark:text-primary-400 font-semibold">Minting</span>, <span className="text-red-600 dark:text-red-400 font-semibold">Blacklisting</span>, dan <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Pausing</span>). Hal ini memastikan bahwa tidak ada lagi otoritas terpusat yang bisa menyalahgunakan wewenang secara sepihak terhadap aset pengguna.
                                </p>
                            </div>
                        </div>


                        {/* Video Education Section */}
                        <div className="max-w-4xl mx-auto mt-24 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Kenali Lebih Dalam Tentang Web3</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                                Pelajari bagaimana teknologi desentralisasi mengubah masa depan internet dan keuangan digital di seluruh dunia.
                            </p>
                            <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.15)] border border-slate-300/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 pt-[56.25%] group">
                                <iframe 
                                    className="absolute top-0 left-0 w-full h-full rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                                    src="https://www.youtube-nocookie.com/embed/PKX8Ep5k0Mg?rel=0" 
                                    title="Edukasi Web3" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">*Video ilustrasi edukasi Crypto</p>
                        </div>

                        {/* FAQ Section */}
                        <div className="max-w-4xl mx-auto mt-20 mb-10 text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Pertanyaan Investor (FAQ)</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-xl mx-auto">
                                Temukan jawaban atas pertanyaan umum seputar keamanan investasi dan pentingnya desentralisasi token.
                            </p>
                            <div className="space-y-4">
                                <details className="group bg-white/80 dark:bg-slate-900/80 border border-slate-300/50 dark:border-slate-700/50 rounded-xl overflow-hidden cursor-pointer shadow-lg">
                                    <summary className="font-bold text-lg text-slate-900 dark:text-white p-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                                        Mengapa berinvestasi di token yang terdesentralisasi?
                                        <span className="text-primary-600 dark:text-primary-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-5 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-300/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                                        Dalam ekosistem desentralisasi penuh, uang Anda sepenuhnya berada di tangan Anda. Tidak ada perantara atau pihak sentral (seperti bank, admin, atau developer) yang dapat menahan, membekukan, atau menyita dana Anda. Hal ini memberikan tingkat keamanan dan kebebasan finansial tertinggi.
                                    </div>
                                </details>

                                <details className="group bg-white/80 dark:bg-slate-900/80 border border-slate-300/50 dark:border-slate-700/50 rounded-xl overflow-hidden cursor-pointer shadow-lg">
                                    <summary className="font-bold text-lg text-slate-900 dark:text-white p-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                                        Apa bahayanya berinvestasi di token sentralistik?
                                        <span className="text-primary-600 dark:text-primary-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-5 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-300/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                                        Token sentralistik memiliki "titik kegagalan tunggal" (<em>Single Point of Failure</em>). Jika admin atau developer token tersebut berniat buruk (<em>rug pull</em>) atau diretas, mereka bisa mengaktifkan fungsi <strong className="text-yellow-600 dark:text-yellow-400">Pause</strong> untuk menghentikan semua perdagangan, atau menggunakan fungsi <strong className="text-red-600 dark:text-red-400">Blacklist</strong> untuk membekukan dompet Anda agar token tidak bisa dijual.
                                    </div>
                                </details>

                                <details className="group bg-white/80 dark:bg-slate-900/80 border border-slate-300/50 dark:border-slate-700/50 rounded-xl overflow-hidden cursor-pointer shadow-lg">
                                    <summary className="font-bold text-lg text-slate-900 dark:text-white p-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                                        Bagaimana IkkyToken menjamin keamanan dana saya?
                                        <span className="text-primary-600 dark:text-primary-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <div className="p-5 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-300/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                                        IkkyToken menyediakan fitur <strong className="text-green-600 dark:text-green-400">Renounce Ownership</strong>. Saat fitur ini ditekan, developer melepaskan seluruh hak akses khusus mereka secara permanen (<em>irreversible</em>). Kontrak pintar (<em>smart contract</em>) menjadi 100% mandiri dan berjalan otomatis di blockchain tanpa ada siapa pun yang bisa mengubah aturannya atau membekukan dana pengguna lagi.
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                ) : !isContractConfigured ? (
                    /* Contract Not Configured */
                    <div className="text-center py-20 animate-slide-down-fade">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Kontrak Belum Dikonfigurasi</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-6">
                            Silakan deploy smart contract terlebih dahulu, lalu update <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-primary-600 dark:text-primary-400">CONTRACT_ADDRESS</code> di file{' '}
                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-primary-600 dark:text-primary-400">src/config/contract.js</code>
                        </p>
                        <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-transparent rounded-xl p-4 max-w-lg mx-auto text-left">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Langkah-langkah:</p>
                            <ol className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                                <li>1. <code>npm install</code> di root folder</li>
                                <li>2. <code>npx hardhat compile</code></li>
                                <li>3. <code>npx hardhat node</code> (terminal baru)</li>
                                <li>4. <code>npx hardhat run scripts/deploy.js --network localhost</code></li>
                                <li>5. Copy alamat kontrak ke <code>src/config/contract.js</code></li>
                            </ol>
                        </div>
                    </div>
                ) : (
                    /* Connected State */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-down-fade">
                        {/* Left Column - Dashboard & Admin */}
                        <div className="lg:col-span-2 space-y-8">
                            <OwnershipDashboard contract={contract} account={account} />
                            
                            <TokenomicsChart contract={contract} account={account} isRenounced={isRenounced} />
                            
                            {/* Simulasi Pengguna Biasa */}
                            <TransferToken contract={contract} onTransaction={handleTransaction} />

                            <AdminPanel
                                contract={contract}
                                isOwner={isOwner && !isRenounced}
                                isPaused={isPaused}
                                onTransaction={handleTransaction}
                            />
                            <RenounceOwnership
                                contract={contract}
                                isOwner={isOwner}
                                isRenounced={isRenounced}
                                onTransaction={handleTransaction}
                            />
                        </div>

                        {/* Right Column - Transaction Log */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <TransactionLog transactions={transactions} />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Enhanced Footer */}
            <footer className="mt-20 pb-8 px-4">
                <div className="max-w-6xl mx-auto glass rounded-xl border border-slate-300/50 dark:border-slate-700/50 p-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-600 dark:text-slate-300 shadow-lg relative overflow-hidden transition-colors duration-300">
                    {/* Glowing Top Border */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 opacity-50"></div>
                    
                    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/80 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider">SYSTEM ONLINE</span>
                    </div>
                    
                    <div className="text-center md:text-right">
                        <p className="font-bold text-slate-900 dark:text-white text-base tracking-wide">IkkyToken DApp <span className="text-cyan-600 dark:text-cyan-400 ml-1 text-sm font-mono bg-cyan-100 dark:bg-cyan-900/30 px-2 py-0.5 rounded">v1.0</span></p>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">Fokus Skripsi: Pencegahan Kontrol Sentralistik pada Token ERC-20</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
