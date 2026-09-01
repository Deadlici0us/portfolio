import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage;

  const toggleLanguage = () => {
    i18n.changeLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={t('language.toggle')}
      title={t('language.toggle')}
    >
      <span className={language === 'en' ? 'active' : ''}>
        <img
          src={require('../assets/united-kingdom.png')}
          alt="English"
          className={`flag en-flag ${language === 'en' ? 'active' : ''}`}
        />
      </span>
      <div className={`toggle ${language === 'es' ? 'active' : ''}`}>
        <div className="circle"></div>
      </div>
      <span className={language === 'es' ? 'active' : ''}>
        <img
          src={require('../assets/spain.png')}
          alt="Español"
          className={`flag es-flag ${language === 'es' ? 'active' : ''}`}
        />
      </span>
    </button>
  );
}

export default LanguageToggle;
