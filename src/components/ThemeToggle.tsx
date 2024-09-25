import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "./ThemeContext.tsx";
import "./ThemeToggle.css";

function ThemeToggle() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { theme, toggleTheme } = themeContext;

  return (
    <div className='theme-toggle' onClick={toggleTheme}>
      <FontAwesomeIcon
        icon={theme === "light" ? faMoon : faSun}
        className={`icon ${theme}`}
      />
    </div>
  );
}

export default ThemeToggle;
