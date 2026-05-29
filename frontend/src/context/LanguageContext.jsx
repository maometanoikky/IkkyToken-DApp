import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../config/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    // Load language from localStorage, default to 'id' (Indonesian)
    const [language, setLanguageState] = useState(() => {
        const savedLang = localStorage.getItem('lang');
        return savedLang === 'en' || savedLang === 'id' ? savedLang : 'id';
    });

    const setLanguage = (lang) => {
        if (lang === 'id' || lang === 'en') {
            setLanguageState(lang);
            localStorage.setItem('lang', lang);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === 'id' ? 'en' : 'id');
    };

    // Translation function with dynamic parameter replacement
    const t = (key, params = {}) => {
        const langTranslations = translations[language] || translations['id'];
        let text = langTranslations[key];

        // Fallback to Indonesian if key not found in active language
        if (text === undefined) {
            text = translations['id'][key];
        }

        // Fallback to key itself if still not found
        if (text === undefined) {
            return key;
        }

        // Replace parameters like {address} or {amount}
        Object.keys(params).forEach((param) => {
            text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
        });

        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
