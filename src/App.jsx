import React, { useState } from "react";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Education from "./components/Education/Education";
import Projects from "./components/Projects/Projects";
import Sidebar from "./components/Sidebar/Sidebar";
import TechStack from "./components/TechStack/TechStack";
import Testimonial from "./components/Testimonial/Testimonial";
import WorkExperience from "./components/WorkExperience/WorkExperience";
import "normalize.css"
import ScrollToTop from "react-scroll-to-top";
import "./App.css";
import NavbarMobile from "./components/Sidebar/NavbarMobile";
import Footer from "./components/Footer/Footer";


function App() {

  const [theme, setTheme] = useState("light");

  const changeTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <>
      <div className="App" id={theme}>
        <NavbarMobile changeTheme={changeTheme} theme={theme}/>
        <Sidebar changeTheme={changeTheme}/>
        <About/>
        <TechStack/>
        <WorkExperience/>
        <Projects />
        <Education/>
        <Testimonial/>
        <Contact/>
        <Footer/>
      </div>
      <ScrollToTop smooth={true}
        top="20"
        color="white"
        height="20"
        width="20"
        style={{borderRadius: "50%", background: "#3d3d3d"}}
      />
    </>
  );
}

export default App;
