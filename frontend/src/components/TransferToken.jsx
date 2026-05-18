import { useState } from 'react';
import { parseEther } from 'ethers';

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

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!recipientAddress || !transferAmount) {
            alert('Mohon isi alamat penerima dan jumlah token!');
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
                message: `Memproses transfer ${transferAmount} KYT...`
            });

            await tx.wait();

            onTransaction({
                type: 'transfer',
                hash: tx.hash,
                status: 'success',
                message: `Berhasil mentransfer ${transferAmount} KYT ke ${recipientAddress.slice(0, 6)}...`
            });

            setRecipientAddress('');
            setTransferAmount('');
        } catch (error) {
            console.error('Transfer error:', error);
            
            // Highlight specific errors for thesis demonstration
            let errorMessage = error.reason || error.message || 'Transfer gagal!';
            if (errorMessage.includes('Pausable: paused') || errorMessage.includes('Contract is paused')) {
                errorMessage = '❌ DITOLAK: Kontrak sedang di-PAUSE oleh Admin!';
            } else if (errorMessage.includes('Address is blacklisted')) {
                errorMessage = '❌ DITOLAK: Alamat pengirim atau penerima terdaftar di BLACKLIST!';
            } else if (errorMessage.includes('ERC20: transfer amount exceeds balance')) {
                errorMessage = '❌ DITOLAK: Saldo tidak mencukupi!';
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
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transfer Token</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Kirim token KYT ke alamat lain (Simulasi Pengguna)</p>
                </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Alamat Penerima</label>
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
                    <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Jumlah (KYT)</label>
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
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Memproses...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Kirim Token
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
