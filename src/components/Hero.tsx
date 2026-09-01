import React from 'react';
import './Hero.css';
import Links from './Links.tsx';
import { useTranslation } from 'react-i18next';

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero" id="intro">
      <div className="terminal" role="img" aria-label="Developer terminal">
        <div className="terminal-bar">
          <span className="terminal-light terminal-light-red"></span>
          <span className="terminal-light terminal-light-yellow"></span>
          <span className="terminal-light terminal-light-green"></span>
          <span className="terminal-title">anibal@portfolio:~$</span>
        </div>
        <div className="terminal-body">
          <p className="terminal-line">
            <span className="terminal-prompt">$</span> whoami
          </p>
          <p className="terminal-line terminal-output terminal-output-name">
            {t('Anibal')}
          </p>
          <p className="terminal-line">
            <span className="terminal-prompt">$</span> cat role.txt
          </p>
          <p className="terminal-line terminal-output">{t('Developer')}</p>
          <p className="terminal-line">
            <span className="terminal-prompt">$</span> cat about.txt
          </p>
          <p className="terminal-line terminal-output terminal-output-muted">
            {t('description')}
          </p>
          <p className="terminal-line terminal-input-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-cursor" aria-hidden="true"></span>
          </p>
        </div>
      </div>

      <Links />
    </section>
  );
}

export default Hero;
