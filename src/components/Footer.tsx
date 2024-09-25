import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <div className='footer'>
      <p>{t("footer")}</p>
    </div>
  );
}

export default Footer;
