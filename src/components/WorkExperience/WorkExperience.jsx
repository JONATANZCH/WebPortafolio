import React from "react";
import "./WorkExperience.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { DiReact } from "react-icons/di";

const WorkExperience = () => {
  const data = [
    {
      companyname: "Banco Azteca",
      position: "Analista de Datos y captación",
      year: "Diciembre 2019 – Diciembre 2020",
      place: "México, Texcoco, Méx",
      des: "Analizar base de datos con más de 5 mil clientes para clasificarlos en base a sus capacidades y diseño de estrategia de servicio y retención ofreciéndoles instrumentos financieros;",
      logros: [
        {
          logro:
            "① Logré incrementar hasta en un 20% las ventas en seguros y retener hasta un 50% al cliente en base a la estrategia y planeación por medio del análisis y programación de datos",
        },
        {
          logro:
            "② Desarrollé hasta en 30% la cultura del ahorro en los clientes de inversión a través del rendimiento financiero obtenido por el banco y la estrategia planteada para el crecimiento y rendimiento del banco.",
        },
      ],
    },
    {
      companyname: "Banco Azteca",
      position: "Asesor financiero",
      year: "Diciembre 2018 – Diciembre 2019",
      place: "México, Texcoco, Méx.",
      des: "Analicé base de datos con más de 10 mil clientes para guiar a las personas en que puedan conseguir los objetivos que se hayan planteado, buscando siempre la mejora de la salud financiera de los clientes;",
      logros: [
        {
          logro:
            "① Logré incrementar hasta en un 90% la captación y afiliación de clientes potenciales;",
        },
        {
          logro:
            "② Logré manejar 60 clientes nuevos por semana y venderles crédito a través de una solicitud honesta y financieramente sana para que el cliente pudiera alcanzar sus metas a través esta herramienta financiera.",
        },
      ],
    },
    {
      companyname: "Banco Azteca",
      position: "Analista de Nómina",
      year: "Diciembre 2017 – Diciembre 2018",
      place: "México, Texcoco, Méx.",
      des: "Analizar los datos y documentos de las nominas en busca de deficiencias y errores.",
      logros: [
        {
          logro:
            "① Diseñé, documenté e implementé procedimientos para optimizar los procesos de nominas.",
        },
        {
          logro:
            "② Apoyé en un 30% la negociación con los clientes para acuerdos de pago.",
        },
        {
          logro:
            "③ Destaqué superar en un 25% a mis compañeros el monto prestamos en mi cartera de clientes la cuál tenía un valor de 12 millones de pesos.",
        },
      ],
    },
  ];

  const colors = ["#fdd0d0", "#c0b6ca", "#0c2638"];

  return (
    <div className="container" id="workExperience">
      <div className="section-title work-section">
        <h5 className="work">Work Experience</h5>
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
              icon={<DiReact />}
              key={index}
            >
              <h3 className="vertical-timeline-element-title">
                {item.companyname}
              </h3>
              <h5 className="vertical-timeline-element-subtitle" style={{color: "#ffffff"}}>
                {item.position}
              </h5>
              <p className="item-des">{item.des}</p>
              <strong className="place">{item.place}</strong>
              <div className="row">
                {item.logros.map((logro, index) => (
                  <div
                    className="col-xl-6 col-lg-6 col-md-6 col-sm-12"
                    key={index}
                  >
                    <div className="logros-list">
                      <p>{logro.logro}</p>
                    </div>
                  </div>
                ))}
              </div>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default WorkExperience;
