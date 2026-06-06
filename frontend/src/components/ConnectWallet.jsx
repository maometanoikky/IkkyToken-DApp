import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { formatAddress, NETWORKS } from '../config/contract';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-hot-toast';

export default function ConnectWallet({ account, setAccount, setSigner, setProvider }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [networkName, setNetworkName] = useState('');
    const { t, language } = useLanguage();

    // Auto-connect and check for pending network toast
    useEffect(() => {
        const checkAutoConnect = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        const provider = new BrowserProvider(window.ethereum);
                        const signer = await provider.getSigner();
                        const network = await provider.getNetwork();
                        
                        setProvider(provider);
                        setSigner(signer);
                        setAccount(accounts[0]);
                        
                        const actualNetworkName = network.name === 'unknown' ? 'Localhost' : network.name;
                        setNetworkName(actualNetworkName);

                        // If there was a pending network switch, show success toast
                        const pendingSwitch = localStorage.getItem('pending_network_toast');
                        if (pendingSwitch) {
                            toast.success(
                                language === 'id'
                                    ? `Berhasil beralih ke jaringan ${actualNetworkName}!`
                                    : `Successfully switched to ${actualNetworkName} network!`
                            );
                            localStorage.removeItem('pending_network_toast');
                        }
                    }
                } catch (err) {
                    console.error("Auto connect error:", err);
                }
            }
        };
        checkAutoConnect();
    }, [language, setAccount, setProvider, setSigner]);

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert(t('metaMaskNotInstalled'));
            return;
        }

        setIsConnecting(true);
        try {
            // Memaksa MetaMask memunculkan jendela pemilihan akun (wallet_requestPermissions)
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            });

            // Request account access setelah pemilihan akun
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Create provider and signer
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

            // Meminta Tanda Tangan Kriptografi untuk Verifikasi Kepemilikan Akun
            const message = t('verificationMessage', {
                address: accounts[0],
                timestamp: new Date().toLocaleString()
            });
            await signer.signMessage(message);

            setProvider(provider);
            setSigner(signer);
            setAccount(accounts[0]);
            setNetworkName(network.name === 'unknown' ? 'Localhost' : network.name);

            // Listen for account changes
            window.ethereum.on('accountsChanged', (newAccounts) => {
                if (newAccounts.length === 0) {
                    disconnectWallet();
                } else {
                    setAccount(newAccounts[0]);
                }
            });

            // Listen for network changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });

        } catch (error) {
            console.error('Error connecting wallet:', error);
            // Menangani error -32002 (Request already pending) dengan pesan yang ramah pengguna
            if (error.code === -32002 || (error.message && error.message.includes('already pending'))) {
                alert(t('alreadyPending'));
            } else {
                alert(t('connectionFailed', { error: error.message }));
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setSigner(null);
        setProvider(null);
        setNetworkName('');
    };

    const switchToSepolia = async () => {
        const toastId = toast.loading(
            language === 'id'
                ? "Meminta beralih ke jaringan Sepolia..."
                : "Requesting switch to Sepolia network..."
        );
        localStorage.setItem('pending_network_toast', 'sepolia');
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORKS.sepolia.chainId }]
            });
            toast.success(
                language === 'id' ? "Berhasil beralih ke Sepolia!" : "Successfully switched to Sepolia!",
                { id: toastId }
            );
            localStorage.removeItem('pending_network_toast');
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORKS.sepolia]
                    });
                    toast.success(
                        language === 'id' ? "Berhasil menambahkan & beralih ke Sepolia!" : "Successfully added & switched to Sepolia!",
                        { id: toastId }
                    );
                    localStorage.removeItem('pending_network_toast');
                } catch (addError) {
                    console.error('Error adding network:', addError);
                    toast.error(
                        language === 'id' ? `Gagal menambahkan jaringan Sepolia: ${addError.message}` : `Failed to add Sepolia network: ${addError.message}`,
                        { id: toastId }
                    );
                    localStorage.removeItem('pending_network_toast');
                }
            } else {
                console.error('Error switching network:', error);
                toast.error(
                    language === 'id' ? `Gagal mengalihkan jaringan: ${error.message}` : `Failed to switch network: ${error.message}`,
                    { id: toastId }
                );
                localStorage.removeItem('pending_network_toast');
            }
        }
    };

    const switchToLocalhost = async () => {
        const toastId = toast.loading(
            language === 'id'
                ? "Meminta beralih ke jaringan Localhost..."
                : "Requesting switch to Localhost network..."
        );
        localStorage.setItem('pending_network_toast', 'localhost');
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORKS.localhost.chainId }]
            });
            toast.success(
                language === 'id' ? "Berhasil beralih ke Localhost!" : "Successfully switched to Localhost!",
                { id: toastId }
            );
            localStorage.removeItem('pending_network_toast');
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORKS.localhost]
                    });
                    toast.success(
                        language === 'id' ? "Berhasil menambahkan & beralih ke Localhost!" : "Successfully added & switched to Localhost!",
                        { id: toastId }
                    );
                    localStorage.removeItem('pending_network_toast');
                } catch (addError) {
                    console.error('Error adding network:', addError);
                    toast.error(
                        language === 'id' ? `Gagal menambahkan jaringan Localhost: ${addError.message}` : `Failed to add Localhost network: ${addError.message}`,
                        { id: toastId }
                    );
                    localStorage.removeItem('pending_network_toast');
                }
            } else {
                console.error('Error switching network:', error);
                toast.error(
                    language === 'id' ? `Gagal mengalihkan jaringan: ${error.message}` : `Failed to switch network: ${error.message}`,
                    { id: toastId }
                );
                localStorage.removeItem('pending_network_toast');
            }
        }
    };

    if (account) {
        return (
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                <div className="flex w-full md:w-auto items-center gap-2 justify-between md:justify-start">
                    {networkName && (
                        <span className="badge-info capitalize py-2 px-3 text-xs md:text-sm font-semibold">{networkName}</span>
                    )}
                    <div className="glass rounded-xl px-4 py-2 flex items-center gap-2.5 flex-1 md:flex-none justify-center">
                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></div>
                        <span className="text-slate-900 dark:text-white font-semibold text-xs md:text-sm tracking-wide">{formatAddress(account)}</span>
                    </div>
                </div>
                <button
                    onClick={disconnectWallet}
                    className="btn-secondary text-sm py-2.5 px-4 cursor-pointer w-full md:w-auto text-center justify-center font-bold"
                >
                    {t('disconnect')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* Connect Wallet Button */}
            <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary flex items-center justify-center gap-2.5 cursor-pointer w-full md:w-auto py-3 px-5 text-sm font-bold shadow-lg"
            >
                {isConnecting ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('connecting')}
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        {t('connectWalletBtn')}
                    </>
                )}
            </button>

            {/* Network Buttons Row */}
            <div className="flex w-full md:w-auto gap-2.5">
                <button
                    onClick={switchToLocalhost}
                    className="btn-secondary flex-1 md:flex-none text-center justify-center text-sm py-2.5 px-4 cursor-pointer font-bold"
                    title="Switch to Localhost"
                >
                    Localhost
                </button>
                <button
                    onClick={switchToSepolia}
                    className="btn-secondary flex-1 md:flex-none text-center justify-center text-sm py-2.5 px-4 cursor-pointer font-bold"
                    title="Switch to Sepolia Testnet"
                >
                    Sepolia
                </button>
            </div>
        </div>
    );
}
