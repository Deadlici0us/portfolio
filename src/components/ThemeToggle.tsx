import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from './ThemeContext.tsx';
import './ThemeToggle.css';
import { useTranslation } from 'react-i18next';

function ThemeToggle() {
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();

  if (!themeContext) return null;

  const { theme, toggleTheme } = themeContext;
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={t('theme.toggle', { theme: nextTheme })}
      title={t('theme.toggle', { theme: nextTheme })}
    >
      <FontAwesomeIcon
        icon={theme === 'light' ? faMoon : faSun}
        className="icon"
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
