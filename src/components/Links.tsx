import React from "react";
import "./Links.css";
import githubIcon from "../assets/github2.png";
import linkedinIcon from "../assets/linkedin.png";
import emailIcon from "../assets/email.png";

function Links() {
  return (
    <div className='links_panel'>
      <div>
        <a
          href='https://www.linkedin.com/in/anibal-f/'
          title='Linkedin'
          target='_blank'
          rel='noopener noreferrer'>
          <p className='links_paragraph'>
            <img
              src={linkedinIcon}
              alt='linkedin'
              className='links_icon icon_linkedin'
            />
          </p>
        </a>
      </div>
      <div>
        <a
          href='https://github.com/Deadlici0us'
          title='Github'
          target='_blank'
          rel='noopener noreferrer'>
          <p className='links_paragraph'>
            <img
              src={githubIcon}
              alt='github'
              className='links_icon icon_github'
            />
          </p>
        </a>
      </div>
      <div>
        <a href='#contact' title='Send me an email'>
          <p className='links_paragraph'>
            <img
              src={emailIcon}
              alt='email'
              className='links_icon icon_email'
            />
          </p>
        </a>
      </div>
    </div>
  );
}

export default Links;
