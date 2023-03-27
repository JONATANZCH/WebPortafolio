import React from "react";
import "./Education.css";
import { FcGraduationCap } from "react-icons/fc";
import {
    VerticalTimeline,
    VerticalTimelineElement,
  } from "react-vertical-timeline-component";
  import "react-vertical-timeline-component/style.min.css";

const Education = () => {

    const data = [
        {
            name: "Academlo",
            degre: "Programador Full-Stack",
            year: "G-2022/2023",
            description: "Programa intensivo y optimizado para adquirir habilidades necesarias para la industria de la tecnología y programacion web"
        },
        {
            name: "Tecnológico de estudios superiores de Chimal.",
            degre: "Ing. Industrial",
            year: "2021-2022 (Pausado)",
            description: "Diseña, mejora e integra sistemas productivos de bienes y servicios aplicando tecnologías para su optimización y diseña, implementa y mejora sistemas de trabajo para elevar la productividad."
        },
        {
            name: "Análisis de Datos de Google.",
            degre: "Data Analiys",
            year: "2022",
            description: "Desarrollé habilidades de gran demanda para procesar, analizar datos, crear visualizaciones que puedan proporcionar información para tomar decisiones comerciales importantes. /Coursera/"
        },
        {
            name: "Video y Publicidad de Google ADS",
            degre: "Marketing Crece con Google",
            year: "2021",
            description: "Conceptos básicos de cómo llegar a los diferentes públicos con las soluciones de anuncios de video de Google y YouTube."
        },
    ]

    const colors = ["#fdd0d0","#0c2638", "#c0b6ca", "#7f58a3"];

  return (
    <div className="container" id="education">
      <div className="section-title sec-title">
        <h5 className="projects-title">Education</h5>
        <hr className="about-line" />
      </div>

      <div className="timline-section">
        <VerticalTimeline lineColor={"#0c2638"}>
          {data.map((item, index) => (
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: colors[index], color: "#000000" }}
              contentArrowStyle={{ borderRight: "7px solid #0c2638" }}
              date={item.year}
              dateClassName="date-class"
              iconStyle={{ background: colors[index], color: "#fff" }}
              icon={<FcGraduationCap />}
              key={index}
            >
              <h3 className="vertical-timeline-element-title">
                {item.name}
              </h3>
              <h5 className="vertical-timeline-element-subtitle" style={{color: "#ffffff"}}>
                {item.degre}
              </h5>
              <p>{item.description}</p>
              <strong className="place">{item.place}</strong>
              
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default Education;
