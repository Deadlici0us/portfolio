import React from 'react';
import './Navbar.css';
import Home from './Home.tsx';
import LanguageToggle from './LanguageToggle.tsx';
import ThemeToggle from './ThemeToggle.tsx';

function Navbar() {
  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-brand">
        <Home />
      </div>

      <div className="navbar-actions">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
