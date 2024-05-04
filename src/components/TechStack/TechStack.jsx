import React, { useState } from "react";
import "./TechStack.css";
import stackImage from "./stackImage";

const TechStack = () => {
  const [showMore, setShowMore] = useState(6);

  const loadMore = () => {
    setShowMore((prev) => prev + 3);
  };

  const data = [
    {
      name: "Bootstrap",
      image: stackImage.bootstrap,
      description:
        "Libreria para aplicar estilos que he utilizado para facilitar animaciones y elementos complejos para asi poder llevar a cabo tu proyecto en la brevedad posible.",
    },
    {
      name: "Node js",
      image: stackImage.node,
      description:
        "Entorno en el que me especializo del lado del back-end para asi desarollar tu aplicacion fullstack.",
    },
    {
      name: "React js",
      image: stackImage.rea,
      description:
        "Libreria en la que me especializo para maquetar estilar y agregar funcionalidades a tu sitio y asi poder ofrecerte la mejor calidad de proyectos.",
    },
    {
      name: "Vue js",
      image: stackImage.vue,
      description:
        "Framework principal que utilízo para la construcción de interfaces de usuario y aplicaciones web de una sola página",
    },
    {
      name: "SASS",
      image: stackImage.sass,
      description:
        "Experiencia en estilar los componentes para tu sitio web, con increibles diseños completamente responsive y llenos de funciones.",
    },
    {
      name: "JavaScript",
      image: stackImage.javaScript,
      description:
        "Basto conocimiento en lo que es basicamente el motor de un sitio funcional para asi cubrir las necesidades de cada cliente.",
    },
    {
      name: "SQL",
      image: stackImage.sql,
      description:
        "Experiencia en el lenguaje y dominio específico, para administrar, y recuperar información de sistemas de gestión de bases de datos relacionales.​",
    },
    {
      name: "Next js",
      image: stackImage.next,
      description:
        "Framework de React con el que he trabajado en proyectos  front-end para tener funcionalidades únicas como la representación del lado del servidor",
    },
    {
      name: "Python",
      image: stackImage.python,
      description:
        "Sólidos conocimientos básicos para programar ampliamente en aplicaciones web, ciencia de datos y machine learning.",
    },
    {
      name: "Laravel",
      image: stackImage.laravel,
      description:
        "Sólidos conocimientos básicos para utilizar las herramientas y recursos únicos para crear aplicaciones modernas y ordenadas.",
    },
    {
      name: "PHP",
      image: stackImage.php,
      description:
        "Bases sólidas de programación con PHP y lógica orientada y dinamica.",
    },
    {
      name: "Git",
      image: stackImage.git,
      description:
        "Herramienta de control de versiones que utilizo principalmente para guardar repositorios y trabajar facilmente de forma remota.",
    },
    {
      name: "CSS",
      image: stackImage.css,
      description:
        "Amplia experiencia en todo lo referente a estilar las secciones para tu sitio web, con increibles diseños completamente personalizados y llenos de animaciones y funciones.",
    },
    {
      name: "HTML",
      image: stackImage.html,
      description:
        "Basto conocimiento de como estructurar y desplegar tu sitio para que sea visible en la web.",
    },
    {
      name: "Postgre SQL",
      image: stackImage.postgres,
      description:
        "Herramienta que he utilizado en gestión de bases de datos relacionales orientado a objetos.",
    },
    {
      name: "Tailwind",
      image: stackImage.tailwind,
      description:
        "Herramienta que he utilizado en para estilar páginas web de una manera rápida y única.",
    },
    {
      name: "Nest",
      image: stackImage.nest,
      description:
        "Framework favorito de backend en el cual me especializo.",
    },
    {
      name: "Replit",
      image: stackImage.replit,
      description:
        "Herramienta que he utilizado principalmente para trabajar en equipo en ejercicios de lógica con diversas tecnologías.",
    },
  ];

  return (
    <div className="container techstack-section" id="techStack">
      <div className="section-title">
        <h5>Tech Stack</h5>
        <hr className="about-line" />
      </div>

      <div className="row">
        {data.slice(0, showMore).map((item, index) => (
          <div
            className="col-xl-4 col-lg-4 col-md-6 col-sm-12 tech-card"
            key={index}
          >
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="tech-content">
                    <span className="tech-number">
                      <img src={item.image} alt="logo" />
                    </span>
                    <p>{item.name}</p>
                  </div>
                </div>
                <div className="flip-card-back">
                  <p className="card-back-title">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMore >= data.length ? null : (
        <div className="load">
          <button className="load-more" onClick={loadMore}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default TechStack;
