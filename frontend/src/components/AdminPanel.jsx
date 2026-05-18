import { useState } from 'react';
import { parseEther } from 'ethers';

/**
 * AdminPanel Component
 * 
 * Panel admin untuk owner yang berisi fungsi:
 * - Mint token ke alamat tertentu
 * - Pause/Unpause transfer token
 */
export default function AdminPanel({ contract, isOwner, isPaused, onTransaction }) {
    const [mintAddress, setMintAddress] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [blacklistAddress, setBlacklistAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMint = async (e) => {
        e.preventDefault();
        if (!mintAddress || !mintAmount) {
            alert('Mohon isi alamat dan jumlah token!');
            return;
        }

        setIsSubmitting(true);
        try {
            const amount = parseEther(mintAmount);
            const tx = await contract.mint(mintAddress, amount);

            onTransaction({
                type: 'mint',
                hash: tx.hash,
                status: 'pending',
                message: `Minting ${mintAmount} KYT ke ${mintAddress}...`
            });

            const receipt = await tx.wait();

            onTransaction({
                type: 'mint',
                hash: tx.hash,
                status: 'success',
                message: `Berhasil mint ${mintAmount} KYT ke ${mintAddress}`
            });

            setMintAddress('');
            setMintAmount('');
        } catch (error) {
            console.error('Mint error:', error);
            onTransaction({
                type: 'mint',
                hash: null,
                status: 'error',
                message: error.reason || error.message || 'Mint gagal!'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePause = async () => {
        setIsSubmitting(true);
        try {
            const tx = await contract.pause();

            onTransaction({
                type: 'pause',
                hash: tx.hash,
                status: 'pending',
                message: 'Mem-pause token transfer...'
            });

            await tx.wait();

            onTransaction({
                type: 'pause',
                hash: tx.hash,
                status: 'success',
                message: 'Token berhasil di-pause!'
            });
        } catch (error) {
            console.error('Pause error:', error);
            onTransaction({
                type: 'pause',
                hash: null,
                status: 'error',
                message: error.reason || error.message || 'Pause gagal!'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnpause = async () => {
        setIsSubmitting(true);
        try {
            const tx = await contract.unpause();

            onTransaction({
                type: 'unpause',
                hash: tx.hash,
                status: 'pending',
                message: 'Meng-unpause token transfer...'
            });

            await tx.wait();

            onTransaction({
                type: 'unpause',
                hash: tx.hash,
                status: 'success',
                message: 'Token berhasil di-unpause!'
            });
        } catch (error) {
            console.error('Unpause error:', error);
            onTransaction({
                type: 'unpause',
                hash: null,
                status: 'error',
                message: error.reason || error.message || 'Unpause gagal!'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBlacklist = async (e) => {
        e.preventDefault();
        if (!blacklistAddress) {
            alert('Mohon isi alamat untuk di-blacklist!');
            return;
        }

        setIsSubmitting(true);
        try {
            const tx = await contract.blacklist(blacklistAddress);
            onTransaction({
                type: 'blacklist',
                hash: tx.hash,
                status: 'pending',
                message: `Memasukkan ${blacklistAddress} ke blacklist...`
            });

            await tx.wait();

            onTransaction({
                type: 'blacklist',
                hash: tx.hash,
                status: 'success',
                message: `Alamat ${blacklistAddress} berhasil di-blacklist!`
            });
            setBlacklistAddress('');
        } catch (error) {
            console.error('Blacklist error:', error);
            onTransaction({
                type: 'blacklist',
                hash: null,
                status: 'error',
                message: error.reason || error.message || 'Gagal menambahkan ke blacklist!'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnblacklist = async (e) => {
        e.preventDefault();
        if (!blacklistAddress) {
            alert('Mohon isi alamat untuk di-unblacklist!');
            return;
        }

        setIsSubmitting(true);
        try {
            const tx = await contract.unblacklist(blacklistAddress);
            onTransaction({
                type: 'unblacklist',
                hash: tx.hash,
                status: 'pending',
                message: `Mengeluarkan ${blacklistAddress} dari blacklist...`
            });

            await tx.wait();

            onTransaction({
                type: 'unblacklist',
                hash: tx.hash,
                status: 'success',
                message: `Alamat ${blacklistAddress} berhasil dikeluarkan dari blacklist!`
            });
            setBlacklistAddress('');
        } catch (error) {
            console.error('Unblacklist error:', error);
            onTransaction({
                type: 'unblacklist',
                hash: null,
                status: 'error',
                message: error.reason || error.message || 'Gagal mengeluarkan dari blacklist!'
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (!isOwner) {
        return (
            <div className="card border-slate-300/50 dark:border-slate-600/50 opacity-60">
                <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-xl font-bold text-slate-500 dark:text-slate-500">Panel Admin</h2>
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-center py-8">
                    Anda bukan owner. Panel ini hanya dapat diakses oleh owner kontrak.
                </p>
            </div>
        );
    }

    return (
        <div className="card border-primary-500/30 dark:glow-purple shadow-[0_0_20px_rgba(139,92,246,0.1)] dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Panel Admin (Owner Only)</h2>
            </div>

            {/* Mint Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Mint Token
                </h3>
                <form onSubmit={handleMint} className="space-y-3">
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Alamat Penerima</label>
                        <input
                            type="text"
                            value={mintAddress}
                            onChange={(e) => setMintAddress(e.target.value)}
                            placeholder="0x..."
                            className="input-field font-mono text-sm"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Jumlah Token (KYT)</label>
                        <input
                            type="number"
                            value={mintAmount}
                            onChange={(e) => setMintAmount(e.target.value)}
                            placeholder="1000"
                            className="input-field"
                            min="0"
                            step="any"
                            disabled={isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Mint Token
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Pause/Unpause Section */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause Control
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handlePause}
                        disabled={isSubmitting || isPaused}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${isPaused
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-yellow-600 hover:bg-yellow-500 text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pause
                    </button>
                    <button
                        onClick={handleUnpause}
                        disabled={isSubmitting || !isPaused}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${!isPaused
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-500 text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unpause
                    </button>
                </div>
            </div>

            {/* Blacklist Section */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Blacklist Control
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Alamat Target</label>
                        <input
                            type="text"
                            value={blacklistAddress}
                            onChange={(e) => setBlacklistAddress(e.target.value)}
                            placeholder="0x..."
                            className="input-field font-mono text-sm"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleBlacklist}
                            disabled={isSubmitting}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Blacklist
                        </button>
                        <button
                            onClick={handleUnblacklist}
                            disabled={isSubmitting}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Unblacklist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
