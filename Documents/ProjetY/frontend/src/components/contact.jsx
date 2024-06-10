import React from "react";
import './styles/contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-heading">Contact Us</h1>
      <p className="contact-text">If you have any questions, suggestions, or just want to say hello, feel free to reach out to us:</p>
      <ul className="contact-list">
        <li>Email: parvizyoussef@gmail.com</li>
        <li>Phone: +1234567890</li>
        <li>Address: 123 Main Street, City, Country</li>
      </ul>
    </div>
  );
};

export default Contact;
