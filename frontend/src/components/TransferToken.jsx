import { useState } from 'react';
import { parseEther } from 'ethers';
import { useLanguage } from '../context/LanguageContext';
import { formatAddress } from '../config/contract';

/**
 * TransferToken Component
 * 
 * Memungkinkan pengguna untuk mentransfer token mereka ke alamat lain.
 * Fitur ini sangat penting untuk mendemonstrasikan kegagalan transaksi
 * saat kontrak di-pause atau saat alamat pengirim/penerima di-blacklist.
 */
export default function TransferToken({ contract, onTransaction }) {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!recipientAddress || !transferAmount) {
            alert(t('fillRecipientAndAmount'));
            return;
        }

        setIsSubmitting(true);
        try {
            const amount = parseEther(transferAmount);
            const tx = await contract.transfer(recipientAddress, amount);

            onTransaction({
                type: 'transfer',
                hash: tx.hash,
                status: 'pending',
                message: t('processTransfer', { amount: transferAmount })
            });

            await tx.wait();

            onTransaction({
                type: 'transfer',
                hash: tx.hash,
                status: 'success',
                message: t('successTransfer', { amount: transferAmount, address: formatAddress(recipientAddress) })
            });

            setRecipientAddress('');
            setTransferAmount('');
        } catch (error) {
            console.error('Transfer error:', error);
            
            // Highlight specific errors for thesis demonstration
            let errorMessage = error.reason || error.message || 'Transfer gagal!';
            if (errorMessage.includes('Pausable: paused') || errorMessage.includes('Contract is paused') || errorMessage.includes('enforced pause')) {
                errorMessage = t('rejectedPaused');
            } else if (errorMessage.includes('Sender is blacklisted') || errorMessage.includes('Receiver is blacklisted') || errorMessage.includes('blacklisted')) {
                errorMessage = t('rejectedBlacklisted');
            } else if (errorMessage.includes('ERC20: transfer amount exceeds balance') || errorMessage.includes('amount exceeds balance') || errorMessage.includes('exceeds balance')) {
                errorMessage = t('rejectedLowBalance');
            }

            onTransaction({
                type: 'transfer',
                hash: null,
                status: 'error',
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card border-blue-500/30">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('transferTitle')}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t('transferDesc')}</p>
                </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">{t('recipientAddress')}</label>
                    <input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder="0x..."
                        className="input-field font-mono text-sm border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">{t('amountKyt')}</label>
                    <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="0.0"
                        min="0"
                        step="any"
                        className="input-field border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {t('sending')}
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            {t('sendTokenBtn')}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
