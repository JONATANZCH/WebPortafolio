import React from "react";
import imagenes from "./imagenes";
import "./Banner.css";
import Typewriter from "typewriter-effect";
import { GlitchText } from 'glitch-text';
import MyCv from "../image/Jonatan.pdf";
import { 
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineTwitter,
  AiOutlineWhatsApp
} from "react-icons/ai";
import { BsFacebook, BsGithub } from "react-icons/bs";

const Banner = () => {
  let urlGit = "https://github.com/JONATANZCH"
  let urlInsta = "https://www.instagram.com/jonzch7/"
  let urlLink = "https://www.linkedin.com/in/jonatanzch-data-science/"
  let urlTwit = "https://twitter.com/Jonzch"
  let urlFace = "https://www.facebook.com/davidjonatanz"
  let urlWats = "https://api.whatsapp.com/send?phone=%2B525532909930&text=Hola%2C+quiero+saber+m%C3%A1s+sobre+tus+servicios"
  return (
      <section className="grid-container">
        {/* banner-container */}
          <div className="content">
            {/* Titulo */}
              <h1 className="title s-center"><span className="title-span">Soy </span ><GlitchText theme='purple' text="Jonatan Chávez"/></h1>
              <h2 className="s-center title">
                <Typewriter
                options={{
                  strings: [
                    "Web Developer",
                    "Data Analyst",
                    "Full Stack Developer"
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 3
                }}
                />
              </h2>
          {/* Descripción */}
            <p className="description s-center">
              Me especializo en React Js y bases de datos para el desarrollo de aplicaciones web fullstack completamente responsive y que se ajusten a tus necesidades como cliente.
            </p>
          {/* Redes */}
            <div className="form-container s-center">
              <form className="form">
                <a className="form-icon-g form-icon" href={urlGit} target="_blank" rel="noopener noreferrer"><BsGithub size={19}/></a>
                <a className="form-icon-i form-icon" href={urlInsta} target="_blank" rel="noopener noreferrer"><AiOutlineInstagram size={20}/></a>
                <a className="form-icon-l form-icon" href={urlLink} target="_blank" rel="noopener noreferrer"><AiOutlineLinkedin size={20}/></a>
                <a className="form-icon-t form-icon" href={urlTwit} target="_blank" rel="noopener noreferrer"><AiOutlineTwitter size={20}/></a>
                <a className="form-icon-w form-icon" href={urlWats} target="_blank" rel="noopener noreferrer"><AiOutlineWhatsApp size={20}/></a>
                <a className="form-icon-f form-icon" href={urlFace} target="_blank" rel="noopener noreferrer"><BsFacebook size={19}/></a>
              </form>
              <a href={MyCv} download="Jonatan_cv.pdf"><button className="form-hint button s-center">Download CV</button></a>
            </div>
          {/* Countdown */}
            <div className="countdown flex">
              <span className="countdown-p">Works:</span>
              <div className="flex">
                <div className="countdown-item flex">
                  <span className="countdown-number">+40</span>
                  <span className="countdown-letter">Proyects</span>
                </div>
                <div className="countdown-item flex">
                  <span className="countdown-number">+10000</span>
                  <span className="countdown-letter">Hrs. of Studing</span>
                </div>
                <div className="countdown-item flex">
                  <span className="countdown-number">+25</span>
                  <span className="countdown-letter">Contributions</span>
                </div>
                <div className="countdown-item flex">
                  <span className="countdown-number">5</span>
                  <span className="countdown-letter">Years of Experience</span>
                </div>
              </div>
            </div>
        </div>
        {/* Gráfico */}
          <div className="graphic">
            <img className="graphic-robot" src={imagenes.robot} alt="robot" />
            <div className="graphic-circles absolute">
                  <img
                  className="graphic-circle-1 absolute"
                  src={imagenes.interior}
                  alt="circleInt"
                  />
                  <img
                  className="graphic-circle-2 absolute"
                  src={imagenes.exterior}
                  alt="circleExt"
                  />
                  <img
                  className="graphic-energy absolute"
                  src={imagenes.energia}
                  alt="energy"
                  />
            </div>
          </div>
      </section>
  );
};

export default Banner;
