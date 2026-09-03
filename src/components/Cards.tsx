import React, { useState } from 'react';
import './Cards.css';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';
import dockerIcon from '../assets/docker.png';
import javascriptIcon from '../assets/javascript.png';
import reactIcon from '../assets/react.png';
import nodeIcon from '../assets/nodejs.png';
import postgreIcon from '../assets/postgre.png';
import rustIcon from '../assets/rust.png';
import typescriptIcon from '../assets/typescript.png';
import wasmIcon from '../assets/wasm.png';
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
  docker?: boolean;
  javascript?: boolean;
  node?: boolean;
  postgre?: boolean;
  react?: boolean;
  rust?: boolean;
  typescript?: boolean;
  wasm?: boolean;
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
  docker,
  javascript,
  node,
  postgre,
  react,
  rust,
  typescript,
  wasm,
  masm,
  win64,
}: CardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <article className="card">
      <div className="card-body">
        <figure className="card-image">
          {!isLoaded && <div className="image-placeholder">{t('loading')}</div>}
          <img
            src={image}
            alt={alt_img}
            className={isLoaded ? 'loaded' : 'hidden'}
            onLoad={() => setIsLoaded(true)}
          />
        </figure>
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
        <div className="card-links">
          {www && wwwtext && (
            <a
              href={www}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGlobe} className="link-icon" />
              <span>{wwwtext}</span>
            </a>
          )}
          <a
            href={github}
            className="text-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithubBrand} className="link-icon" />
            <span>{githubtext}</span>
          </a>
        </div>
        <ul className="card-stacks">
          {docker && (
            <li className="stack-item">
              <img src={dockerIcon} alt="Docker" className="stack-icon" />
              <span className="stack-name">Docker</span>
            </li>
          )}
          {javascript && (
            <li className="stack-item">
              <img
                src={javascriptIcon}
                alt="JavaScript"
                className="stack-icon"
              />
              <span className="stack-name">JavaScript</span>
            </li>
          )}
          {node && (
            <li className="stack-item">
              <img src={nodeIcon} alt="Node.js" className="stack-icon" />
              <span className="stack-name">Node.js</span>
            </li>
          )}
          {postgre && (
            <li className="stack-item">
              <img src={postgreIcon} alt="PostgreSQL" className="stack-icon" />
              <span className="stack-name">PostgreSQL</span>
            </li>
          )}
          {react && (
            <li className="stack-item">
              <img src={reactIcon} alt="ReactJS" className="stack-icon" />
              <span className="stack-name">ReactJS</span>
            </li>
          )}
          {rust && (
            <li className="stack-item">
              <img src={rustIcon} alt="Rust" className="stack-icon" />
              <span className="stack-name">Rust</span>
            </li>
          )}
          {typescript && (
            <li className="stack-item">
              <img
                src={typescriptIcon}
                alt="TypeScript"
                className="stack-icon"
              />
              <span className="stack-name">TypeScript</span>
            </li>
          )}
          {wasm && (
            <li className="stack-item">
              <img src={wasmIcon} alt="WebAssembly" className="stack-icon" />
              <span className="stack-name">WebAssembly</span>
            </li>
          )}
          {masm && (
            <li className="stack-item">
              <span className="stack-name">MASM</span>
            </li>
          )}
          {win64 && (
            <li className="stack-item">
              <span className="stack-name">Win64</span>
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
      aria-labelledby="cards-heading"
    >
      <h2 id="cards-heading" className="section-heading cards-heading">
        {t('cards-title')}
      </h2>
      {Object.keys(cardData).map((key, index) => (
        <Card key={index} {...cardData[key]} />
      ))}
    </section>
  );
}

export default Cards;
