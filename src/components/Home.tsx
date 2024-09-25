import React from "react";
import "./Home.css";
import homeIcon from "../assets/home.png";

function Home() {
  return (
    <div className='home-stack'>
      <a href='#intro' title='Home'>
        <p className='home-paragraph'>
          <img src={homeIcon} alt='Home' className='home-icon' />
        </p>
      </a>
    </div>
  );
}

export default Home;
