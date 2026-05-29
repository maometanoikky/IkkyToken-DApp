import { useState, useEffect } from 'react';
import { formatAddress, formatTokenAmount } from '../config/contract';
import { useLanguage } from '../context/LanguageContext';

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
    const { t } = useLanguage();

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
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Ownership Status Card */}
            <div className={`card relative overflow-hidden ${isRenounced ? 'border-emerald-500/50 glow' : 'border-slate-300 dark:border-slate-700/50'}`}>
                {/* Background Glow Effect - Only glow green when decentralized */}
                {isRenounced && (
                    <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none bg-emerald-500"></div>
                )}
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {t('dashboardTitle')}
                    </h2>
                    
                    {/* Dynamic Security Badge */}
                    <div className="flex-shrink-0">
                        {isRenounced ? (
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-emerald-400 font-bold text-sm tracking-wide">{t('fullyDecentralized')}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 px-4 py-2 rounded-full backdrop-blur-md transition-all">
                                <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <span className="text-slate-600 dark:text-slate-300 font-semibold text-sm tracking-wide">{t('statusCentralized')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">{t('currentOwner')}</label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <code className={`text-sm sm:text-lg font-mono ${isZeroAddress ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'} break-all`}>
                                {isZeroAddress ? t('noOwner') : ownerAddress}
                            </code>
                            {isOwner && !isRenounced && (
                                <span className="badge-info text-xs">{t('you')}</span>
                            )}
                        </div>
                    </div>

                    {isPaused && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                            <p className="text-yellow-400 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t('tokenPausedWarning')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Token Info Card */}
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('tokenInfoTitle')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-transparent">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('tokenName')}</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{tokenInfo.name}</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-transparent">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('tokenSymbol')}</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{tokenInfo.symbol}</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-transparent">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('tokenTotalSupply')}</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{formatTokenAmount(tokenInfo.totalSupply, tokenInfo.decimals)}</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-transparent">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{t('tokenYourBalance')}</p>
                        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">{formatTokenAmount(userBalance, tokenInfo.decimals)}</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={fetchContractData}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('refreshData')}
                </button>
                <a
                    href={`https://sepolia.etherscan.io/address/${contract?.target || contract?.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 border border-slate-300 dark:border-slate-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t('viewEtherscan')}
                </a>
            </div>
        </div>
    );
}
