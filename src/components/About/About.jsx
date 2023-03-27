import React from "react";
import "./About.css";
import image from "../image/me.jpg";

const About = () => {
  return (
    <div className="about container" id="about">
      <div className="row">
        <div className="tools">
          <div className="circle">
            <span className="red box"></span>
          </div>
          <div className="circle">
            <span className="yellow box"></span>
          </div>
          <div className="circle">
            <span className="green box"></span>
          </div>
        </div>

        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          
            <div className="about-image">
              <img src={image} alt="me image" />
            </div>
          
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          
            <h2 className="about-title">Hola soy David J. Zapeta Ch.</h2>
          
          <hr className="about-line" />
          
            <p className="about-details">
              Soy desarrollador web, me apasiona la tecnología y el análisis
              empresarial, ademas que la música ya que toco guitarra y piano.
              Tengo 28 años y soy del Estado de México, me encantaría ser parte
              de tu equipo, si tienes alguna duda o quieres saber más de mi,
              puedes contactarme a través de mis redes sociales o por un mensaje
              a traves del formulario de contacto.
            </p>
          
        </div>
      </div>
    </div>
  );
};

export default About;
