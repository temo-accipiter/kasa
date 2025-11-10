import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.scss';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const otherLanguage = i18n.language === 'fr' ? 'en' : 'fr';
  const otherLanguageLabel = t(`language.${otherLanguage}`);

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="language-switcher"
      aria-label={t('language.switchTo', { language: otherLanguageLabel })}
    >
      {otherLanguage.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;
