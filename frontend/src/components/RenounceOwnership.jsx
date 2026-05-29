import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * RenounceOwnership Component
 * 
 * Tombol besar dengan konfirmasi ganda untuk melepaskan kepemilikan secara permanen.
 * PERINGATAN: Aksi ini TIDAK DAPAT DIBATALKAN!
 */
export default function RenounceOwnership({ contract, isOwner, isRenounced, onTransaction }) {
    const [showModal, setShowModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    const CONFIRM_PHRASE = 'RENOUNCE';

    const handleRenounce = async () => {
        if (confirmText !== CONFIRM_PHRASE) {
            alert(t('typePhraseValidation'));
            return;
        }

        setIsSubmitting(true);
        try {
            const tx = await contract.renounceOwnershipPermanently();

            onTransaction({
                type: 'renounce',
                hash: tx.hash,
                status: 'pending',
                message: t('renounceInProgress')
            });

            await tx.wait();

            onTransaction({
                type: 'renounce',
                hash: tx.hash,
                status: 'success',
                message: t('renounceSuccess')
            });

            setShowModal(false);
            setConfirmText('');
        } catch (error) {
            console.error('Renounce error:', error);
            onTransaction({
                type: 'renounce',
                hash: null,
                status: 'error',
                message: error.reason || error.message || t('renounceFailed')
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isRenounced) {
        return (
            <div className="card border-green-500/30 bg-green-500/5">
                <div className="text-center py-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">{t('decentralizedCardTitle')}</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        {t('decentralizedCardDesc')}
                    </p>
                </div>
            </div>
        );
    }

    if (!isOwner) {
        return null;
    }

    return (
        <>
            {/* Main Button */}
            <div className="card border-red-500/30">
                <div className="text-center">
                    <div className="mb-4">
                        <svg className="w-12 h-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('renounceTitle')}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {t('renounceDesc')}
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-danger text-lg glow-red w-full max-w-md cursor-pointer"
                    >
                        {t('renounceBtn')}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 border border-red-300 dark:border-red-500/50 rounded-2xl max-w-lg w-full p-6 animate-pulse-slow">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-2">{t('renounceWarningTitle')}</h3>
                            <p className="text-slate-600 dark:text-slate-300">
                                {t('renounceWarningDesc')}
                            </p>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                            <p className="text-red-600 dark:text-red-400 text-sm mb-2 font-semibold">{t('afterActionTitle')}</p>
                            <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-1">
                                <li>{t('afterAction1')}</li>
                                <li>{t('afterAction2')}</li>
                                <li>{t('afterAction3')}</li>
                                <li>{t('afterAction4')}</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                                {t('typePhrase')}
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                placeholder={t('typePhrasePlaceholder')}
                                className="input-field text-center font-bold text-lg"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setConfirmText('');
                                }}
                                disabled={isSubmitting}
                                className="flex-1 btn-secondary cursor-pointer"
                            >
                                {t('cancelBtn')}
                            </button>
                            <button
                                onClick={handleRenounce}
                                disabled={isSubmitting || confirmText !== CONFIRM_PHRASE}
                                className={`flex-1 btn-danger cursor-pointer ${confirmText === CONFIRM_PHRASE ? 'glow-red' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        {t('sending')}
                                    </span>
                                ) : (
                                    t('confirmRenounceBtn')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
