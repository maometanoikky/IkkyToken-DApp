import { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { Toaster, toast } from 'react-hot-toast';

// Components
import ConnectWallet from './components/ConnectWallet';
import OwnershipDashboard from './components/OwnershipDashboard';
import AdminPanel from './components/AdminPanel';
import RenounceOwnership from './components/RenounceOwnership';
import TransactionLog from './components/TransactionLog';

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
        <div className="min-h-screen pb-10">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#e2e8f0',
                        border: '1px solid #334155'
                    }
                }}
            />

            {/* Header */}
            <header className="glass border-b border-slate-700/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">K</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">IkkyToken DApp</h1>
                            <p className="text-xs text-slate-400">Decentralized ERC-20 Token</p>
                        </div>
                    </div>
                    <ConnectWallet
                        account={account}
                        setAccount={setAccount}
                        setSigner={setSigner}
                        setProvider={setProvider}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {!account ? (
                    /* Not Connected State */
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Selamat Datang di IkkyToken DApp</h2>
                        <p className="text-slate-400 max-w-md mx-auto mb-8">
                            DApp untuk demonstrasi pencegahan kontrol sentralistik pada token ERC-20.
                            Hubungkan wallet MetaMask untuk memulai.
                        </p>
                        <div className="flex justify-center">
                            <ConnectWallet
                                account={account}
                                setAccount={setAccount}
                                setSigner={setSigner}
                                setProvider={setProvider}
                            />
                        </div>
                    </div>
                ) : !isContractConfigured ? (
                    /* Contract Not Configured */
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Kontrak Belum Dikonfigurasi</h2>
                        <p className="text-slate-400 max-w-lg mx-auto mb-6">
                            Silakan deploy smart contract terlebih dahulu, lalu update <code className="bg-slate-800 px-2 py-1 rounded text-primary-400">CONTRACT_ADDRESS</code> di file{' '}
                            <code className="bg-slate-800 px-2 py-1 rounded text-primary-400">src/config/contract.js</code>
                        </p>
                        <div className="bg-slate-800/50 rounded-xl p-4 max-w-lg mx-auto text-left">
                            <p className="text-sm text-slate-400 mb-2">Langkah-langkah:</p>
                            <ol className="text-sm text-slate-300 space-y-2">
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Dashboard & Admin */}
                        <div className="lg:col-span-2 space-y-6">
                            <OwnershipDashboard contract={contract} account={account} />
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

            {/* Footer */}
            <footer className="text-center py-6 text-slate-500 text-sm">
                <p>IkkyToken DApp - Skripsi Informatika</p>
                <p className="text-xs mt-1">Pencegahan Kontrol Sentralistik pada Token ERC-20</p>
            </footer>
        </div>
    );
}

export default App;
