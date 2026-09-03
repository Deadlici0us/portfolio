import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark'; // Add initialTheme prop
}

const THEME_COLOR: Record<'light' | 'dark', string> = {
  light: '#f6f7fb',
  dark: '#0e101a',
};

const applyThemeColor = (theme: 'light' | 'dark') => {
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );
  if (meta) meta.content = THEME_COLOR[theme];
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme || 'dark');

  useEffect(() => {
    applyThemeColor(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
