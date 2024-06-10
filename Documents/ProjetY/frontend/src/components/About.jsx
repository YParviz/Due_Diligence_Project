import React from 'react';
import './styles/about.css';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-heading">About Us</h1>
      <p className="about-text">
        We are a team of 5 developers who have worked together to create this application. We are passionate about software development and have put in a lot of effort to make this application as user-friendly as possible.
        This application was part of a project for our software engineering course. 
        <br/><br/>
        We have used various technologies to build this application and have learned a lot in the process.
        <br/><br/>
        We hope you enjoy using our application and we are always open to feedback. Feel free to contact us if you have any questions or suggestions.
      </p>
    </div>
  );
};

export default About;
