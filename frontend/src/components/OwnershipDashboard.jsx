import { useState, useEffect } from 'react';
import { formatAddress, formatTokenAmount } from '../config/contract';

/**
 * OwnershipDashboard Component
 * 
 * Menampilkan status kepemilikan kontrak saat ini.
 * Informasi yang ditampilkan:
 * - Alamat owner saat ini
 * - Status ownership (Active/Renounced)
 * - Token info (name, symbol, total supply)
 */
export default function OwnershipDashboard({ contract, account }) {
    const [ownerAddress, setOwnerAddress] = useState('');
    const [isRenounced, setIsRenounced] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [tokenInfo, setTokenInfo] = useState({ name: '', symbol: '', totalSupply: '0', decimals: 18 });
    const [userBalance, setUserBalance] = useState('0');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (contract) {
            fetchContractData();
        }
    }, [contract, account]);

    const fetchContractData = async () => {
        setIsLoading(true);
        try {
            const [owner, renounced, paused, name, symbol, decimals, totalSupply] = await Promise.all([
                contract.owner(),
                contract.isOwnershipRenounced(),
                contract.paused(),
                contract.name(),
                contract.symbol(),
                contract.decimals(),
                contract.totalSupply()
            ]);

            setOwnerAddress(owner);
            setIsRenounced(renounced);
            setIsPaused(paused);
            setTokenInfo({ name, symbol, decimals: Number(decimals), totalSupply: totalSupply.toString() });

            if (account) {
                const balance = await contract.balanceOf(account);
                setUserBalance(balance.toString());
            }
        } catch (error) {
            console.error('Error fetching contract data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isOwner = account && ownerAddress && account.toLowerCase() === ownerAddress.toLowerCase();
    const isZeroAddress = ownerAddress === '0x0000000000000000000000000000000000000000';

    if (isLoading) {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-slate-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Ownership Status Card */}
            <div className={`card ${isRenounced ? 'border-green-500/30 glow' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Status Kepemilikan
                    </h2>
                    {isRenounced ? (
                        <span className="badge-success">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            DESENTRALISASI
                        </span>
                    ) : (
                        <span className="badge-warning">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            TERPUSAT
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 block mb-1">Current Owner Address</label>
                        <div className="flex items-center gap-2">
                            <code className={`text-lg font-mono ${isZeroAddress ? 'text-green-400' : 'text-white'} break-all`}>
                                {isZeroAddress ? 'address(0) - Tidak Ada Owner' : ownerAddress}
                            </code>
                            {isOwner && !isRenounced && (
                                <span className="badge-info text-xs">Anda</span>
                            )}
                        </div>
                    </div>

                    {isPaused && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-yellow-400 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Token sedang di-PAUSE. Transfer tidak dapat dilakukan.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Token Info Card */}
            <div className="card">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Token Info
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-sm text-slate-400">Nama</p>
                        <p className="text-lg font-semibold text-white">{tokenInfo.name}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-sm text-slate-400">Simbol</p>
                        <p className="text-lg font-semibold text-white">{tokenInfo.symbol}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-sm text-slate-400">Total Supply</p>
                        <p className="text-lg font-semibold text-white">{formatTokenAmount(tokenInfo.totalSupply, tokenInfo.decimals)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-sm text-slate-400">Saldo Anda</p>
                        <p className="text-lg font-semibold text-primary-400">{formatTokenAmount(userBalance, tokenInfo.decimals)}</p>
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <button
                onClick={fetchContractData}
                className="btn-secondary w-full flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
            </button>
        </div>
    );
}
