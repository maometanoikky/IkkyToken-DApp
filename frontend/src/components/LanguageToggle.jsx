import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="relative bg-slate-200/40 dark:bg-slate-900/60 border border-slate-300/50 dark:border-slate-800/80 rounded-xl p-1 flex items-center h-10 w-28 overflow-hidden select-none shadow-inner transition-colors duration-300">
            {/* Sliding Pill Background Capsule */}
            <div 
                className={`absolute top-1 bottom-1 w-[50px] bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg transition-all duration-300 shadow-md ${
                    language === 'en' ? 'left-[calc(100%-54px)]' : 'left-1'
                }`}
            />
            
            {/* ID Button */}
            <button
                onClick={() => setLanguage('id')}
                className={`flex-1 text-center font-bold font-mono text-xs z-10 transition-all duration-300 cursor-pointer ${
                    language === 'id' 
                        ? 'text-white font-extrabold scale-105' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Ubah ke Bahasa Indonesia"
            >
                ID
            </button>
            
            {/* EN Button */}
            <button
                onClick={() => setLanguage('en')}
                className={`flex-1 text-center font-bold font-mono text-xs z-10 transition-all duration-300 cursor-pointer ${
                    language === 'en' 
                        ? 'text-white font-extrabold scale-105' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Switch to English"
            >
                EN
            </button>
        </div>
    );
}
