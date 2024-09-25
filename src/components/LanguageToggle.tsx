import React from "react";
import { useTranslation } from "react-i18next";
import "./LanguageToggle.css";

function LanguageToggle() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage;

  const toggleLanguage = () => {
    i18n.changeLanguage(language === "en" ? "es" : "en");
  };

  return (
    <div className='language-toggle' onClick={toggleLanguage}>
      <span className={language === "en" ? "active" : ""}>
        <img
          src={require("../assets/united-kingdom.png")}
          alt='English'
          className={`flag en-flag ${language === "en" ? "active" : ""}`}
        />
      </span>
      <div className={`toggle ${language === "es" ? "active" : ""}`}>
        <div className='circle'></div>
      </div>
      <span className={language === "es" ? "active" : ""}>
        <img
          src={require("../assets/spain.png")}
          alt='Spanish'
          className={`flag es-flag ${language === "es" ? "active" : ""}`}
        />
      </span>
    </div>
  );
}

export default LanguageToggle;
