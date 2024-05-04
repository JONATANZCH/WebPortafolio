import React from "react";
import "./SidebarList.css";
import {
  FcVoicePresentation,
  FcHome,
  FcTodoList,
  FcContacts,
  FcFactory,
  FcLike,
  FcMultipleDevices,
} from "react-icons/fc";
import { MdCastForEducation } from "react-icons/md";
import { Link } from "react-scroll";

const SidebarList = ({ expandSidebar }) => {
  return (
    <React.Fragment>
      {expandSidebar ? (
        <div className="navbar__items">
          <ul>
            <li className="nav__item">
              <Link to="home" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcHome size={25} /> Home{" "}
              </Link>
            </li>
            <li className="nav__item">
              <Link to="about" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcVoicePresentation size={25} /> About{" "}
              </Link>
            </li>
            <li className="nav__item">
              <Link to="techStack" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcMultipleDevices size={25} /> Tech Stack{" "}
              </Link>
            </li>
            <li className="nav__item">
              <Link to="workExperience" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcFactory size={25} /> Work Experience{" "}
              </Link>
            </li>
            <li className="nav__item">
              <Link to="projects" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcTodoList size={25} /> Projects{" "}
              </Link>
            </li>
            <li className="nav__item">
              <Link to="education" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <MdCastForEducation size={25} color="#ffffff" /> Education{" "}
              </Link>
            </li>
            <li className="nav__item">
              <Link to="testimonial" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcLike size={25} /> Testimonial{" "}
              </Link>
            </li>
            <li className="nav__item">
              <Link to="contacto" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcContacts size={25} /> Contact{" "}
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <div className="navbar__icons">
          <ul>
            <li className="nav__item">
              <Link to="home" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcHome size={25} />
              </Link>
            </li>
            <li className="nav__item">
              <Link to="about" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcVoicePresentation size={25} />
              </Link>
            </li>
            <li className="nav__item">
              <Link to="techStack" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcMultipleDevices size={25} />
              </Link>
            </li>
            <li className="nav__item">
              <Link to="workExperience" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcFactory size={25} />
              </Link>
            </li>
            <li className="nav__item">
              <Link to="projects" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcTodoList size={25}/>
              </Link>
            </li>
            <li className="nav__item">
              <Link to="education" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <MdCastForEducation color="#ffffff" size={25} />
              </Link>
            </li>
            <li className="nav__item">
              <Link to="testimonial" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcLike size={25} />
              </Link>
            </li>
            <li className="nav__item">
              <Link to="contacto" 
                spy={true} 
                smooth={true} 
                duration={500} 
                offset={-100}
              >
                <FcContacts size={25} />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};

export default SidebarList;
