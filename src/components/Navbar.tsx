import React from "react";
import "./Navbar.css";
import Home from "./Home.tsx";
import LanguageToggle from "./LanguageToggle.tsx";
import ThemeToggle from "./ThemeToggle.tsx";

function Navbar() {
  return (
    <nav className='navbar'>
      <div>
        <Home />
      </div>
      <div>
        <LanguageToggle />
      </div>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
export default Navbar;
