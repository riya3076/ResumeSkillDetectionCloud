import React, { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AwsConfig from '../AWS_Config';
const AWS = require("aws-sdk");
const ApplyPage = () => {
  const job_id = localStorage.getItem('selectedJobId');
  console.log(job_id);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    resume: null,
    answer: '',
  });


  AwsConfig();
  async function userDetails() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/userdetails";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }

  async function extractskills() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/extractskills";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }


  async function subscribemail() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/subscribemail";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }

  const handleSubmit = async (e) => {
    const applicationId = uuidv4();
    e.preventDefault();
    try {
      const userDetailURL = await userDetails();
        console.log(userDetailURL);
      const resumeBase64 = await convertFileToBase64(formData.resume);
      
      console.log(resumeBase64);
      const response = await axios.post(
        `${userDetailURL}/userdetails`,
        {
          applicationId,
          job_id,
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          answer: formData.answer,
          resume: resumeBase64,
        }
      );

      console.log(response);
      console.log(applicationId);
      if (response.status === 200) {
        console.log('Application submitted successfully:', response.data);
        toast.success('Application submitted successfully');
        const extractSkillsURL = await extractskills();
        const extractDataResponse = await axios.post(
          `${extractSkillsURL}/extractskills`,
          {
            applicationId: applicationId,
          }
        );

        if (extractDataResponse.status === 200) {
          
          console.log('Data extracted successfully:', extractDataResponse.data);
          console.log(formData.email);
          localStorage.setItem('applicantEmail',formData.email);

          const subscribemailURL = await subscribemail();
          const sendEmailResponse = await axios.post(
            `${subscribemailURL}/subscribemail`,
            {
              email: formData.email,
            }
          );
          console.log(sendEmailResponse);
          if (sendEmailResponse.status === 201) {
            console.log('Email sent successfully:', sendEmailResponse.data);
            toast.success('Check your Email...');

          } else {
            console.error('Error sending email:', sendEmailResponse.data);
            toast.error('Error sending email');
          }
        } else {
          console.error('Error extracting data:', extractDataResponse.data);
          toast.error('Error extracting data');
        }
      } else {
        console.error('Error submitting application:', response.data);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error submitting application');
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      resume: file,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const styles = {

    container: {
      margin: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '20px',
    },
    form: {
      maxWidth: '600px',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '16px',
      color: '#555',
      marginTop: '12px',
      marginBottom: '5px',
    },
    input: {
      width: '100%',
      padding: '8px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    button: {
      backgroundColor: '#4caf50',
      color: '#fff',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
    },
  };

  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <div>
      <Link to="/job-openings">
        <Button
          variant="secondary"
          style={{
            padding: '10px 15px',
            borderRadius: '5px',
            top: '20px',
            border: 'none',
            left: '20px',
            position: 'absolute',
            backgroundColor: '#3498db',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          Back
        </Button>
      </Link>

      <h2 style={{ marginTop: '90px', marginLeft: '30px' }}> Apply for Job </h2>
      <Container style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          
          <div style={{ width: '60%' }}>
          <Form onSubmit={handleSubmit} style={styles.form}>
        <Form.Group controlId="formName">
          <Form.Label style={styles.label}>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </Form.Group>
        <Form.Group controlId="formMobile">
          <Form.Label style={styles.label}>Mobile Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter your mobile number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label style={styles.label}>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </Form.Group>
        <Form.Group controlId="formResume">
          <Form.Label style={styles.label}>Upload Resume</Form.Label>
          <Form.Control type="file" accept=".pdf, .doc, .docx" onChange={handleFileChange} required style={styles.input} />
        </Form.Group>
        <Form.Group controlId="formAnswer">
          <Form.Label style={styles.label}>Why are you the best candidate for this job?</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </Form.Group>
        <Button
            variant="primary"
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: buttonHovered ? '#45a049' : '#4caf50',
            }}
            onMouseOver={() => setButtonHovered(true)}
            onMouseOut={() => setButtonHovered(false)}
          >
            Submit Application
          </Button>
          <h2>Don't Forget to subscribe through your mail to get update on your application</h2>
      </Form>


            {/* Toast Container for displaying notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
            />
            
          </div>

          {/* Image Section */}
          <div style={{ marginLeft: '20px' }}>
            <img
              src="https://img.freepik.com/premium-vector/human-resources-flat-style-illustration-design_538610-598.jpg?w=740"
              alt="Human Resources Illustration"
              style={{ width: '600px', height: 'auto', marginRight: '50px' }}
            />
          </div>
        </div>
      </Container>

    </div>

  );
};

export default ApplyPage;
