import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './components/ThemeContext.tsx';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Cards from './components/Cards.tsx';
import ContactForm from './components/ContactForm.tsx';
import Footer from './components/Footer.tsx';
import Sorter from './components/Sorter.tsx';
import Pathfinding from './components/Pathfinding.tsx';
import './i18n.tsx';
import { I18nextProvider } from 'react-i18next';

// Determine the initial theme value
const savedTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;

// Default to light theme, then check savedTheme or prefersDarkScheme
let initialTheme: 'light' | 'dark' = 'light';
if (savedTheme) {
  initialTheme = savedTheme as 'light' | 'dark';
} else if (prefersDarkScheme) {
  initialTheme = 'dark';
}

//Save
document.body.setAttribute('data-theme', initialTheme);
localStorage.setItem('theme', initialTheme);

function Homepage() {
  return (
    <>
      <Hero />
      <Cards />
      <ContactForm />
    </>
  );
}

function App() {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <I18nextProvider>
        <Router>
          <div className="app">
            <div className="bg-animation" aria-hidden="true">
              <div className="bg-orb bg-orb-1"></div>
              <div className="bg-orb bg-orb-2"></div>
              <div className="bg-orb bg-orb-3"></div>
            </div>
            <a className="skip-link" href="#main-content">
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="app-main" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/sorter" element={<Sorter />} />
                <Route path="/pathfinding" element={<Pathfinding />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </I18nextProvider>
    </ThemeProvider>
  );
}
export default App;
