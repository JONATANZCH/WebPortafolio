import React, { useState } from "react";
import "./NavbarMobile.css";
import { CgFormatJustify } from "react-icons/cg";
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
import Switch from "react-switch";

const NavbarMobile = ({theme, changeTheme}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className="mobile-view">
      <div className="navbar-header">
        <p>
          <CgFormatJustify size={25} onClick={handleClick} />
        </p>
      </div>

      {open ? (
        <div className="navbar-mobile">
          <ul>
            <li className="nav__item-mobile">
              <Link
                to="home"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <FcHome size={25} /> Home{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Link
                to="about"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <FcVoicePresentation size={25} /> About{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Link
                to="techStack"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <FcMultipleDevices size={25} /> Tech Stack{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Link
                to="workExperience"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <FcFactory size={25} /> Work Experience{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Link
                to="projects"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <FcTodoList size={25} /> Projects{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Link
                to="education"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <MdCastForEducation size={25} color="#5a16b3" /> Education{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Link
                to="testimonial"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <FcLike size={25} /> Testimonial{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Link
                to="contacto"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                <FcContacts size={25} /> Contact{" "}
              </Link>
            </li>
            <li className="nav__item-mobile">
              <Switch onChange={changeTheme} checked={theme === "light"} />
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default NavbarMobile;
