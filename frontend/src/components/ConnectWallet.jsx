import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { formatAddress, NETWORKS } from '../config/contract';

/**
 * ConnectWallet Component
 * 
 * Komponen untuk menghubungkan wallet MetaMask.
 * Menampilkan tombol connect/disconnect dan alamat wallet.
 */
export default function ConnectWallet({ account, setAccount, setSigner, setProvider }) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [networkName, setNetworkName] = useState('');

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask tidak terinstall! Silakan install MetaMask terlebih dahulu.');
            return;
        }

        setIsConnecting(true);
        try {

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Create provider and signer
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();

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
            alert('Gagal menghubungkan wallet: ' + error.message);
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
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORKS.sepolia.chainId }]
            });
        } catch (error) {
            // If the chain is not added, add it
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORKS.sepolia]
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                }
            }
        }
    };

    const switchToLocalhost = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORKS.localhost.chainId }]
            });
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORKS.localhost]
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                }
            }
        }
    };

    if (account) {
        return (
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                {networkName && (
                    <span className="badge-info capitalize">{networkName}</span>
                )}
                <div className="glass rounded-xl px-4 py-2 flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">{formatAddress(account)}</span>
                </div>
                <button
                    onClick={disconnectWallet}
                    className="btn-secondary text-sm py-2 px-4"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary flex items-center gap-2"
            >
                {isConnecting ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Connecting...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        Connect Wallet
                    </>
                )}
            </button>
            <button
                onClick={switchToLocalhost}
                className="btn-secondary text-sm py-2 px-4"
                title="Switch to Localhost"
            >
                Localhost
            </button>
            <button
                onClick={switchToSepolia}
                className="btn-secondary text-sm py-2 px-4"
                title="Switch to Sepolia Testnet"
            >
                Sepolia
            </button>
        </div>
    );
}
