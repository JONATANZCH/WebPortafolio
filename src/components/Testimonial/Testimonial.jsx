import React from "react";
import "./Testimonial.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonial = () => {

    const data = [
        {
            name: "Edgar Méndez",
            position: "Developer",
            des: "❝Es un compañero muy preparado, respetusoso y con la facilidad de diseñar de una manera fácil y práctica.❞",
            img: "https://ca.slack-edge.com/T04BJ71TNF2-U04BTRLT21F-f6c340bb6cf2-512"
        },
        {
            name: "Eloy Sandoval",
            position: "Front end developer",
            des: "❝Su facilidad para aportar ideas creativas y planear funcionalidades ambiciosas a proyectos complejos es de gran admiración.❞",
            img: "https://ca.slack-edge.com/T04BJ71TNF2-U04B105FXAS-490bfdc54537-512"
        },
        {
            name: "Juan Antonio Ortiz Gutierrez",
            position: "Backend Developer",
            des: "❝Me ha ayudado mucho su resiliencia y explicaciones practicas para entender ciertos temas de bases de datos.❞",
            img: "https://ca.slack-edge.com/T04BJ71TNF2-U04BWDE989Y-e4fc2981069e-512"
        },
        {
            name: "Jose Ricardo Tarazona Hernandez",
            position: "Backend Developer",
            des: "❝Su capacidad para trabajar bajo presión con tiempos y entornos difíciles y con una actitud muy positiva y alegre es inspirador para el equipo.❞",
            img: "https://ca.slack-edge.com/T04BJ71TNF2-U04TBK98TJB-3cf57d7c2ffd-512"
        },
        {
            name: "Otoniel Zapeta",
            position: "Empresario",
            des: "❝Él siempre ha tenido tranquilidad y acertividad cuando se refiere a trabajar en equipo, siempre termina siendo aquel que no le importa trabajar y ayudar de incógnito y anónimo.❞",
            img: "https://scontent.fmex10-1.fna.fbcdn.net/v/t39.30808-6/273688515_109856594957983_912589295259964278_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeENITAq7BJUpWd7hde2MNCStXc0xbo5ADO1dzTFujkAM4jVIdLqABVqN3cSGJHTB8s-BPgjrzT_v3Ik2GCBBWLn&_nc_ohc=JqQ2tPCZmmwAX9Q8cjO&_nc_ht=scontent.fmex10-1.fna&oh=00_AfBpSXrTI79VdOkQVxHEUX1XzdGb39RwWP2mlSbZ6LzMrQ&oe=64219DA5"
        },
        {
            name: "Miguel Sarabia",
            position: "Ing. Ambiental",
            des: "❝Además de su gran amistad tengo el honor de aprender en primera fila de su pasión a las nuevas tecnologías y al desarrollo web.❞",
            img: "https://scontent.fmex10-1.fna.fbcdn.net/v/t39.30808-6/335042986_982927066423672_5009602678691141360_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFjKOTBk5CHINVwmsl5Sy9uXMgw9-thNR5cyDD362E1HorqXFVoG38EZnbC4HGTbzn6ZjcZWU4XvK5RxBiNnaBp&_nc_ohc=7fKKOXas7sQAX8HvglB&_nc_ht=scontent.fmex10-1.fna&oh=00_AfCFHy1DA0r9uFbsVQTY8xNicz2vQwA9nwova9_pSHzrjA&oe=64209462"
        },
        {
            name: "Adrian Paillacho",
            position: "Cliente",
            des: "❝Me ha hecho una página web personal excelente la cual  me ayudó a incrementar mis ventas e interacciones con clientes.❞",
            img: "https://ca.slack-edge.com/T04BJ71TNF2-U04TPBJE2E9-c2a9a622afe5-512"
        },
        {
            name: "Giovanni Almazo",
            position: "Data Analyst",
            des: "❝Trabajé en el banco con David y lo más admirable de él era su servicio, amabilidad y actitud ante los retos laborales y proyectos en conjunto.❞",
            img: "https://scontent.fmex10-4.fna.fbcdn.net/v/t39.30808-6/321216729_552410839765236_8425411001979050137_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeEs4-A-XKb1BEq-DswSyhKhpKpBvZgTyb-kqkG9mBPJvzefd8zFZL2iU7_Bs3tu1HMQm3gPbBzhKJfvsvX4lquf&_nc_ohc=IgXnD3NlzWEAX_Yx_TD&_nc_ht=scontent.fmex10-4.fna&oh=00_AfBzGSXB1FxrVmXkfCBc8-LxQYlKG6tvnzJzb3qviq2rrw&oe=6421AC5A"
        },
    ]

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      initialSlide: 0,
      autoplay: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

  return (
    <div className="container testimonial-section" id="testimonial">

      <div className="section-title sec-title">
        <h5 className="projects-title">Testimonial</h5>
        <hr className="about-line" />
      </div>

      <div className="testimonial-slider">
        <Slider {...settings}>

            {data.map((item, index) => (
                <div className="content-slider-main"  key={index}>
                  
                    <div className="content-slider">
                        <img src={item.img} alt="people" className="center-image"/>
                        <p className="item-name">{item.name}</p>
                        <p className="item-position">{item.position}</p>
                        <p className="item-des">{item.des}</p>
                    </div>
                  
                </div>
            ))}

        </Slider>
      </div>

    </div>
  );
};

export default Testimonial;
