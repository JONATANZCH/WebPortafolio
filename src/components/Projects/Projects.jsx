import React, { useState } from "react";
import ProjectsList from "./ProjectsList";
import "./Projects.css";
import imgProject from "./imgProject";

const Projects = () => {
  const [showMore, setShowMore] = useState(6);

  const loadMore = () => {
    setShowMore((prev) => prev + 3);
  };

  const data = [
    {
      name: "Budget Control",
      imagen: imgProject.budget,
      des: "Una aplicación donde los usuarios pueden controlar y administrar su presupuesto.",
      link: "https://soft-medovik-3643d6.netlify.app/",
      techused: [
        {
          techname: "Node js",
        },
        {
          techname: "Vite js",
        },
        {
          techname: "React js",
        },
        {
          techname: "swipe effect",
        },
      ],
    },
    {
      name: "Cotizador de Criptos",
      imagen: imgProject.criptos,
      des: "Una aplicación que permite cotizar Criptomonedas en tiempo real y en diferentes divisas su valor en el mercado mundial.",
      link: "https://exquisite-medovik-1041d3.netlify.app/",
      techused: [
        {
          techname: "API",
        },
        {
          techname: "Vite js",
        },
        {
          techname: "React js",
        },
        {
          techname: "styiled components",
        },
      ],
    },
    {
      name: "Administración de Pacientes",
      imagen: imgProject.pacientes,
      des: "Aplicación para veterinaria en donde los usuarios pueden administrar y registrar clientes y sus mascotas.",
      link: "https://willowy-axolotl-59da65.netlify.app/",
      techused: [
        {
          techname: "Node js",
        },
        {
          techname: "Vite js",
        },
        {
          techname: "React js",
        },
        {
          techname: "Tailwind CSS",
        },
      ],
    },
    {
      name: "E-Commerce",
      imagen: imgProject.ecommerce,
      des: "Una aplicación donde los usuarios realizan compras de productos electrónicos.",
      link: "https://rad-kitten-7b9ab1.netlify.app/",
      techused: [
        {
          techname: "Redux",
        },
        {
          techname: "Vite js",
        },
        {
          techname: "React js",
        },
        {
          techname: "React-Route",
        },
      ],
    },
    {
      name: "Pokémon App",
      imagen: imgProject.pokemon,
      des: "Una simulación de usuario para mostrar los datos de cada Pokémon",
      link: "https://dainty-crostata-4caf62.netlify.app/",
      techused: [
        {
          techname: "Redux",
        },
        {
          techname: "Framer Motion",
        },
        {
          techname: "React-Route",
        },
        {
          techname: "CSS",
        },
      ],
    },
    {
      name: "E-Commerce",
      imagen: imgProject.ecommerceGuitar,
      des: "Aplicación creada con el fin de simular una tienda de guitarras virtual.",
      link: "https://incomparable-horse-f025b4.netlify.app/",
      techused: [
        {
          techname: "HTML",
        },
        {
          techname: "CSS",
        },
        {
          techname: "JavaScript",
        },
      ],
    },
    {
      name: "Spa web",
      imagen: imgProject.spa,
      des: "Un diseño estatico para un necocio de SPA",
      link: "https://verdant-jalebi-6c7e26.netlify.app/",
      techused: [
        {
          techname: "SASS",
        },
      ],
    },
    {
      name: "Portafolio",
      imagen: imgProject.portafolio,
      des: "Un portafolio con diseños modernos",
      link: "https://glittery-semifreddo-64579c.netlify.app/",
      techused: [
        {
          techname: "CSS",
        },
        {
          techname: "JS",
        },
        {
          techname: "HTML",
        },
      ],
    },
    {
      name: "Real State",
      imagen: imgProject.realState,
      des: "Simulador de bienes raíces",
      link: "https://heroic-melomakarona-b14d21.netlify.app/",
      techused: [
        {
          techname: "SASS",
        },
        {
          techname: "HTML",
        },
        {
          techname: "CSS",
        },
        {
          techname: "JavaScript",
        },
      ],
    },
    {
      name: "Clon de AIRBNB",
      imagen: imgProject.airbnb,
      des: "Diseño Responsivo",
      link: "https://luminous-griffin-4eb5fc.netlify.app/",
      techused: [
        {
          techname: "CSS ",
        },
      ],
    },
    {
      name: "Café Restaurant",
      imagen: imgProject.cafe,
      des: "Diseño de página web de una cafetería",
      link: "https://astounding-paprenjak-33c7b6.netlify.app/",
    },
    {
      name: "21 Blackjack",
      imagen: imgProject.blackjack,
      des: "Bonito juego hecho con JavaScript vailla",
      link: "https://nimble-pothos-bd8422.netlify.app/",
    },
    {
      name: "RickAndMorty",
      imagen: imgProject.Rick,
      des: "API RickAndMorty",
      link: "https://superlative-yeot-9c5196.netlify.app/",
      techused: [
        {
          techname: "ReactJs Vite",
        },
      ],
    },
  ];

  return (
    <div className="container" id="projects">
      <div className="section-title sec-title">
        <h5 className="projects-title">Projects</h5>
        <hr className="about-line" />
      </div>
      <div className="row">
        {data.slice(0, showMore).map((item, index) => (
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12" key={index}>
            <ProjectsList {...item} />
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

export default Projects;
