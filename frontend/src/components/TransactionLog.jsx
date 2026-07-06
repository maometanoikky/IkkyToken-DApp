import { formatAddress } from '../config/contract';
import { useLanguage } from '../context/LanguageContext';

/**
 * TransactionLog Component
 * 
 * Menampilkan log semua transaksi yang dilakukan.
 * Penting untuk bukti pengujian di Bab IV skripsi.
 * Menampilkan status sukses/gagal dan error message untuk revert.
 */
export default function TransactionLog({ transactions }) {
    const { t } = useLanguage();

    if (transactions.length === 0) {
        return (
            <div className="card lg:h-full flex flex-col">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {t('logTitle')}
                </h2>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-500 text-center py-8">
                        {t('noTransactions')}
                    </p>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'pending':
                return (
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            mint: { text: 'MINT', class: 'badge-info' },
            pause: { text: 'PAUSE', class: 'badge-warning' },
            unpause: { text: 'UNPAUSE', class: 'badge-success' },
            renounce: { text: 'RENOUNCE', class: 'badge-danger' },
            transfer: { text: 'TRANSFER', class: 'badge-info' },
            blacklist: { text: 'BLACKLIST', class: 'badge-danger' },
            unblacklist: { text: 'UNBLACKLIST', class: 'badge-success' }
        };
        return labels[type] || { text: type.toUpperCase(), class: 'badge-info' };
    };

    return (
        <div className="card lg:h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t('logTitle')}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({transactions.length})</span>
            </h2>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 min-h-0 max-h-96 lg:max-h-none">
                {transactions.map((tx, index) => {
                    const typeLabel = getTypeLabel(tx.type);
                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border transition-all duration-300 ${tx.status === 'error'
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : tx.status === 'success'
                                        ? 'bg-green-500/5 border-green-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {getStatusIcon(tx.status)}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={typeLabel.class}>{typeLabel.text}</span>
                                        <span className="text-xs text-slate-500">
                                            {new Date().toLocaleTimeString(t('timeFormat'))}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${tx.status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'} break-all`}>
                                        {tx.message}
                                    </p>
                                    {tx.hash && (
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-2 inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            <span className="font-mono">{formatAddress(tx.hash)}</span>
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Error Details for Bab IV Evidence */}
                            {tx.status === 'error' && (
                                <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">{t('detailErrorTitle')}</p>
                                    <code className="text-xs text-red-500 dark:text-red-300 break-all block">
                                        {tx.message}
                                    </code>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
