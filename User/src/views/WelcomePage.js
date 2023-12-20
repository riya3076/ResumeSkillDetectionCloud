import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const WelcomePage = () => {
  const containerStyle = {
    display: 'flex',
    height: '100vh',
    color: 'white',
    padding: '20px',
  };

  const imageColumnStyle = {
    flex: '70%',
    backgroundImage: 'url("https://img.freepik.com/free-vector/businessman-choosing-options-computer_1262-19222.jpg?w=826&t=st=1700549005~exp=1700549605~hmac=59660fd9446d2b10b60c8d0ce9217fbf77cec281b0c81a8d5f1e0c7f307711b5")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '90%',
  };

  const textColumnStyle = {
    flex: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    textAlign: 'right',
  };

  const headingStyle = {
    fontSize: '3em',
    marginBottom: '15px',
    color: '#3498db',
  };

  const textStyle = {
    fontSize: '1.5em',
    marginBottom: '15px',
    color: '#000',
  };

  const additionalTextStyle = {
    fontSize: '1.5em',
    marginTop: '15px',
    color: '#000',
  };

  const [buttonHovered, setButtonHovered] = useState(false);

  const buttonStyle = {
    fontSize: '1.5em',
    backgroundColor: buttonHovered ? '#2980b9' : '#3498db',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    color: 'white',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  };

  return (
    <Container style={containerStyle}>
      <div style={imageColumnStyle}></div>
      <div style={textColumnStyle}>
        <h1 style={headingStyle}>Welcome to TechVista Solutions!</h1>
        <p style={textStyle}>
          Explore exciting job opportunities and take the next step in your career journey.
        </p>
        <p style={additionalTextStyle}>
          We're committed to innovation and excellence in the tech industry.
        </p>
        <Link to="/job-openings">
          <Button
            variant="primary"
            style={buttonStyle}
            onMouseOver={() => setButtonHovered(true)}
            onMouseOut={() => setButtonHovered(false)}
          >
            Apply for a Job
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default WelcomePage;
