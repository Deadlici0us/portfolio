import React from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Links.css';
import { useTranslation } from 'react-i18next';

function Links() {
  const { t } = useTranslation();

  return (
    <ul className="links-panel" aria-label={t('links-label')}>
      <li>
        <a
          href="https://www.linkedin.com/in/anibal-f/"
          title="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="link-icon-button"
        >
          <FontAwesomeIcon icon={faLinkedinIn} className="links-icon" />
        </a>
      </li>
      <li>
        <a
          href="https://github.com/Deadlici0us"
          title="GitHub"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="link-icon-button"
        >
          <FontAwesomeIcon icon={faGithub} className="links-icon" />
        </a>
      </li>
      <li>
        <a
          href="#contact"
          title={t('nav.contact')}
          aria-label={t('nav.contact')}
          className="link-icon-button"
        >
          <FontAwesomeIcon icon={faEnvelope} className="links-icon" />
        </a>
      </li>
    </ul>
  );
}

export default Links;
