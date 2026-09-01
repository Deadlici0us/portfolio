import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>{t('footer', { year })}</p>
    </footer>
  );
}

export default Footer;
