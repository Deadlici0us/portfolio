import React, { useState } from 'react';
import './Cards.css';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';
import dockerIcon from '../assets/docker.png';
import reactIcon from '../assets/react.png';
import nodeIcon from '../assets/nodejs.png';
import typescriptIcon from '../assets/typescript.png';
import postgreIcon from '../assets/postgre.png';
import useOnScreen from './useOnScreen.tsx';

interface CardProps {
  image: string;
  alt_img: string;
  title: string;
  description: string;
  www?: string;
  wwwtext?: string;
  github: string;
  githubtext: string;
  react?: boolean;
  node?: boolean;
  typescript?: boolean;
  docker?: boolean;
  postgre?: boolean;
  masm?: boolean;
  win64?: boolean;
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
  masm,
  win64,
}: CardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <article className="card">
      <div className="card_body">
        <figure className="card_image">
          {!isLoaded && <div className="image-placeholder">{t('loading')}</div>}
          <img
            src={image}
            alt={alt_img}
            className={`card_image ${isLoaded ? 'loaded' : 'hidden'}`}
            onLoad={() => setIsLoaded(true)}
          />
        </figure>
        <h2 className="card_title">{title}</h2>
        <p className="card_description">{description}</p>
        <div className="card_links">
          {www && wwwtext && (
            <a
              href={www}
              className="link_style"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGlobe} className="link_icon" />
              <span>{wwwtext}</span>
            </a>
          )}
          <a
            href={github}
            className="link_style"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithubBrand} className="link_icon" />
            <span>{githubtext}</span>
          </a>
        </div>
        <ul className="card_stacks">
          {docker && (
            <li className="stack_item">
              <img src={dockerIcon} alt="Docker" className="stack_icon" />
              <span className="stack_name">Docker</span>
            </li>
          )}
          {react && (
            <li className="stack_item">
              <img src={reactIcon} alt="ReactJS" className="stack_icon" />
              <span className="stack_name">ReactJS</span>
            </li>
          )}
          {node && (
            <li className="stack_item">
              <img src={nodeIcon} alt="Node.js" className="stack_icon" />
              <span className="stack_name">Node.js</span>
            </li>
          )}
          {typescript && (
            <li className="stack_item">
              <img
                src={typescriptIcon}
                alt="TypeScript"
                className="stack_icon"
              />
              <span className="stack_name">TypeScript</span>
            </li>
          )}
          {postgre && (
            <li className="stack_item">
              <img src={postgreIcon} alt="PostgreSQL" className="stack_icon" />
              <span className="stack_name">PostgreSQL</span>
            </li>
          )}
          {masm && (
            <li className="stack_item">
              <span className="stack_name">MASM</span>
            </li>
          )}
          {win64 && (
            <li className="stack_item">
              <span className="stack_name">Win64</span>
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}

function Cards() {
  const { t } = useTranslation();
  const cardData = t('cards', { returnObjects: true });
  const { isIntersecting, ref } = useOnScreen(0.1);

  return (
    <section
      ref={ref}
      className={`cards ${isIntersecting ? 'show' : ''}`}
      aria-label={t('cards-title')}
    >
      {Object.keys(cardData).map((key, index) => (
        <Card key={index} {...cardData[key]} />
      ))}
    </section>
  );
}

export default Cards;
