import React from "react";
import "./Footer.css";
import instagram from "../image/instagram.svg"
import twitter from "../image/twitter.svg"
import github from "../image/github.svg"
import discord from "../image/discord.svg"
import logo from "../image/logoblack.svg"

const Footer = () => {
  let urlGit = "https://github.com/JONATANZCH"
  let urlInsta = "https://www.instagram.com/jonzch7/"
  let urlLink = "https://www.linkedin.com/in/jonatanzch-data-science/"
  let urlTwit = "https://twitter.com/Jonzch"
  return (
    <div className="footer">
      <div className="main container div1">
        <div className="up">
          <button className="card1">
            <a href={urlInsta} target="_blank" rel="noopener noreferrer">
              <img id="instagram" src={instagram} alt="instagram" />
            </a>
          </button>
          <button className="card2">
            <a href={urlTwit} target="_blank" rel="noopener noreferrer">
              <img className="twitter" src={twitter} alt="twitter" />
            </a>
          </button>
        </div>
        <div className="down">
          <button className="card3">
            <a href={urlGit} target="_blank" rel="noopener noreferrer">
              <img className="github" src={github} alt="github" />
            </a>
          </button>
          <button className="card4">
            <a href={urlLink} target="_blank" rel="noopener noreferrer">
              <img className="discord" src={discord} alt="discord" />
            </a>
          </button>
        </div>
      </div>
      <div className="div2">
        <img src={logo} id="#dark" alt="logo" />
      </div>
    </div>
  );
};

export default Footer;
