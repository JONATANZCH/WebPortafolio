import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const API = "http://localhost:8080/sendemail";

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [jobtypes, setJobtypes] = useState();
  const [message, setMessage] = useState();

  const sendEmailInfo = (e) => {
    e.preventDefault()
    fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        jobtypes,
        message,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if(result.error){
            toast.error(result.error, {
                position: toast.POSITION.TOP_RIGHT
            })
        }else{
            toast.success(result.success, {
                position: toast.POSITION.TOP_RIGHT
            });
            setName("");
            setEmail("");
            setJobtypes("");
            setMessage("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="container contact-section contacto" id="contacto">
      <div className="contenedor-form">
        <div className="texto-form">
          <div className="section-title sec-title text-form-title">
            <h5 className="projects-title">Contact</h5>
            <hr className="about-line" />
          </div>
          <form>
            <div className="contact-form">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="contact-form">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="contact-form">
              <label className="form-label">Job Types</label>
              <select
                className="custom-select-tag"
                value={jobtypes}
                onChange={(e) => setJobtypes(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button className="send-button" onClick={sendEmailInfo}>
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
      <ToastContainer draggable limit={3} autoClose={2000}/>
    </section>
  );
};

export default Contact;