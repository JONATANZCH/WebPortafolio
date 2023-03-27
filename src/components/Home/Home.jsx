import React from "react";
import Banner from "./Banner";
import "./Home.css";

const Home = ({ changeTheme }) => {
  return (
    <div className="container-fluid home" id="home">
      <div className="toggleWrapper">
        <input type="checkbox" className="dn" id="dn" />
        <label htmlFor="dn" className="toggle" onClick={changeTheme}>
          <span className="toggle__handler">
            <span className="crater crater--1"></span>
            <span className="crater crater--2"></span>
            <span className="crater crater--3"></span>
          </span>
          <span className="star star--1"></span>
          <span className="star star--2"></span>
          <span className="star star--3"></span>
          <span className="star star--4"></span>
          <span className="star star--5"></span>
          <span className="star star--6"></span>
        </label>
      </div>
      <Banner />
    </div>
  );
};

export default Home;
