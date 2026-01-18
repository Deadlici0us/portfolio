import React, { useState } from "react";
import "./Cards.css";
import { useTranslation } from "react-i18next";
import githubIcon from "../assets/github.png";
import { t } from "i18next";
import wwwIcon from "../assets/www.png";
import dockerIcon from "../assets/docker.png";
import reactIcon from "../assets/react.png";
import nodeIcon from "../assets/nodejs.png";
import typescriptIcon from "../assets/typescript.png";
import postgreIcon from "../assets/postgre.png";
import useOnScreen from "./useOnScreen.tsx";

interface CardProps {
  image: string;
  alt_img: string;
  title: string;
  description: string;
  www: string;
  wwwtext: string;
  github: string;
  githubtext: string;
  react?: boolean;
  node?: boolean;
  typescript?: boolean;
  docker?: boolean;
  postgre?: boolean;
}

function Card({
  image,
  alt_img,
  title,
  description,
  www,
  wwwtext,
  github,
  githubtext,
  react,
  node,
  typescript,
  docker,
  postgre,
}: CardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className='card'>
      <div className='card_body'>
        <div className='card_image'>
          {!isLoaded && <div className='image-placeholder'>{t("loading")}</div>}
          <img
            src={image}
            alt={alt_img}
            className={`card_image ${isLoaded ? "loaded" : "hidden"}`}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
        <h2 className='card_title'>{title}</h2>
        <p className='card_description'>{description}</p>
        <div className='card_github'>
          <a
            href={www}
            className='link_style'
            target='_blank'
            rel='noopener noreferrer'>
            <img src={wwwIcon} alt='Link' className='stack_icon' />
            <p className='link_name'>{wwwtext}</p>
          </a>
          <a
            href={github}
            className='link_style'
            target='_blank'
            rel='noopener noreferrer'>
            <img src={githubIcon} alt='Github' className='stack_icon' />
            <p className='link_name'>{githubtext}</p>
          </a>
        </div>
        <div className='card_stacks'>
          {docker && (
            <div className='stack_item'>
              <img src={dockerIcon} alt='Docker' className='stack_icon' />
              <p className='stack_name'>Docker</p>
            </div>
          )}
          {react && (
            <div className='stack_item'>
              <img src={reactIcon} alt='ReactJS' className='stack_icon' />
              <p className='stack_name'>ReactJS</p>
            </div>
          )}
          {node && (
            <div className='stack_item'>
              <img src={nodeIcon} alt='Node.js' className='stack_icon' />
              <p className='stack_name'>Node.js</p>
            </div>
          )}
          {typescript && (
            <div className='stack_item'>
              <img
                src={typescriptIcon}
                alt='Typescript'
                className='stack_icon'
              />
              <p className='stack_name'>Typescript</p>
            </div>
          )}
          {postgre && (
            <div className='stack_item'>
              <img src={postgreIcon} alt='Postgres' className='stack_icon' />
              <p className='stack_name'>Postgres </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Cards() {
  const { t } = useTranslation();
  const cardData = t("cards", { returnObjects: true });
  const { isIntersecting, ref } = useOnScreen(0.1);

  return (
    <div ref={ref} className={`cards ${isIntersecting ? "show" : ""}`}>
      {Object.keys(cardData).map((key, index) => (
        <Card key={index} {...cardData[key]} />
      ))}
    </div>
  );
}

export default Cards;
