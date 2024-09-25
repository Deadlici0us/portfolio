import React from "react";
import "./Hero.css";
import Links from "./Links.tsx";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();
  return (
    <div className='hero' id='intro'>
      <p className='welcome'>{t("hello")}</p>
      <p>
        <span className='title'>
          Anibal Flores.<span className='terminal-prompt'>_</span>
        </span>
      </p>
      <Links />
      <p className='description'>{t("description")}</p>
    </div>
  );
}

export default Hero;
