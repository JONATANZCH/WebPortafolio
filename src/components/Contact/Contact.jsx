import React, { useRef, useState } from "react";
import "./Contact.css";
import { BsSend } from "react-icons/bs";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const serviceId = "";
const templateId = "";
const apiKey = "";

const Contact = () => {
  const refForm = useRef();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userJobtypes, setUserJobtypes] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(serviceId, templateId, refForm.current, apiKey)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    if ([userName, userEmail, userEmail, userJobtypes, userMessage].includes('')) {
      toast.error("Please fill in all fields", {
        position: toast.POSITION.TOP_RIGHT,
      })
    } else {
      toast.success("Your message has been sent", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setUserName("");
      setUserEmail("");
      setUserJobtypes("");
      setUserMessage("");
    }
  };

  return (
    <section className="container contact-section contacto" id="contacto">
      <div className="contenedor-form">
        <div className="texto-form">
          <div className="section-title sec-title text-form-title">
            <h5 className="projects-title">Contact</h5>
            <hr className="about-line" />
          </div>
          <form ref={refForm} onSubmit={handleSubmit}>
            <div className="contact-form">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                name="userName"
                
              />
            </div>
            <div className="contact-form">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                name="userEmail"
                
              />
            </div>
            <div className="contact-form">
              <label className="form-label">Job Types</label>
              <select
                className="custom-select-tag"
                value={userJobtypes}
                onChange={(e) => setUserJobtypes(e.target.value)}
                name="userJobtypes"
                
              >
                <option> --- Select --- </option>
                <option>Full-time</option>
                <option>Working Student</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Other</option>
              </select>
            </div>
            <div className="contact-form">
              <label className="form-label">Message</label>
              <textarea
                rows="5"
                type="text"
                className="form-control"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                name="userMessage"
                
              />
            </div>
            <div className="text-center">
              <button className="send-button">
                <span>
                  Send
                  <BsSend size={20} />
                </span>
                <div className="top"></div>
                <div className="left"></div>
                <div className="bottom"></div>
                <div className="right"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer draggable limit={3} autoClose={2000} />
    </section>
  );
};

export default Contact;
