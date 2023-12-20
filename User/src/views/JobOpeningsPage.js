import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import AwsConfig from '../AWS_Config';

const AWS = require("aws-sdk");

const JobOpeningsPage = () => {
  const [jobOpenings, setJobOpenings] = useState([]);

  const handleApplyClick = (jobId) => {
    localStorage.setItem('selectedJobId', jobId);
  };

  AwsConfig();
  async function getJobDetails() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/getjobdata";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }

  async function fetchData() {
    try{
      const getJobDetailsURL = await getJobDetails();

      const response = await axios.get(`${getJobDetailsURL}/getjobdata`);
      console.log(response);
        setJobOpenings(response.data.Items);
    }
    catch (error) {
      console.error('Unable to fetch data from API', error);
 
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'center',
    paddingTop: '50px',
  };

  const leftColumnStyle = {
    flex: 1,
    marginRight: '20px',
  };

  const rightColumnStyle = {
    flex: 1,
    maxWidth: '50%',
    overflow: 'hidden',
  };

  const headingStyle = {
    fontSize: '2.5em',
    marginBottom: '20px',
    color: '#333',
    fontFamily: 'Lobster',
  };

  const cardStyle = {
    width: '80%',
    marginBottom: '20px',
    marginLeft: '50px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    backgroundColor: '#f9f9f9', 
  };

  const backgroundImageStyle = {
    backgroundImage: jobOpenings.length > 0
      ? 'url("https://img.freepik.com/free-vector/successful-business-deal-employee-hiring-recruiting-service_335657-3073.jpg?w=996&t=st=1700799670~exp=1700800270~hmac=9f64fe578f32b02020e00085e70220bdef173a6659b06b95dd84ff381ce33a12")'
      : 'url("https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?w=900&t=st=1701243767~exp=1701244367~hmac=7f4dcc3add07e9e3165b7c9105f1eed3732abfb672185e05ab1f7f2f716c4bdd")',
    backgroundSize: '90%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '15px',
    height: '100%',
  };

  const cardTitleStyle = {
    fontSize: '2em', 
    marginBottom: '10px',
  };

  const [buttonHovered, setButtonHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '15px',
  };

  return (
    <Container className="mt-5" style={containerStyle}>
      <div style={leftColumnStyle}>
        <Link to="/">
          <Button variant="secondary" style={{
            padding: '10px 15px', borderRadius: '5px', top: '20px', border: 'none',
            left: '20px', position: 'absolute', color: 'white', backgroundColor: '#3498db', cursor: 'pointer'
          }}>
            Back
          </Button>
        </Link>
        <h1 style={headingStyle}>Explore Our Job Openings</h1>
        {jobOpenings.length > 0 ? (
          jobOpenings.map((job) => (
            <Card key={job.job_id} style={cardStyle}>
              <Card.Body>
                <Card.Title style={cardTitleStyle}>{job.job_title}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {job.job_location}
                  <br />
                  <strong>Experience:</strong> {job.job_experience}
                </Card.Text>
                <Link to={`/apply/${job.job_id}`}>
                  <Button variant="primary" size="sm" style={{
                    ...buttonStyle,
                    backgroundColor: buttonHovered ? '#45a049' : '#4caf50',
                  }}
                    onMouseOver={() => setButtonHovered(true)}
                    onMouseOut={() => setButtonHovered(false)} onClick={() => handleApplyClick(job.job_id)}>
                    Apply Now
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div>
            <p>No jobs available right now.</p>
            <div style={backgroundImageStyle}></div>
          </div>
        )}
      </div>
      <div style={rightColumnStyle}>
        <div style={{ ...backgroundImageStyle, height: '100vh' }}></div>
      </div>
    </Container>
  );
};

export default JobOpeningsPage;
