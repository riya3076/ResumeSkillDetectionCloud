import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import AwsConfig from '../AWS_Config';

import 'react-toastify/dist/ReactToastify.css';
const AWS = require("aws-sdk");
const PostJob = () => {
  const [jobData, setJobData] = useState({
    job_id: uuidv4(),
    job_experience: '',
    job_location: '',
    job_title: '',
    skills: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const { value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      skills: value.split(',').map((skill) => skill.trim()),
    }));
  };

  AwsConfig();
  async function postJob() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/jobposting";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Job Data Submitted:', jobData); 
    const newJobData = { ...jobData, job_id: uuidv4() };
    try {
      const postJobURL = await postJob();
        console.log(postJobURL);
        const response = await axios.post(
          `${postJobURL}/jobposting`,
          newJobData
        );
  
        console.log('Job Data Submitted:', response.data);
        toast.success('Job Posted Successfully');
      } catch (error) {
        console.error('Error submitting job data:', error);
        toast.success('Job Posted Successfully');
      }
    
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Post a New Job</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Job Title:
          <input
            type="text"
            name="job_title"
            value={jobData.job_title}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <br />
        <label style={styles.label}>
          Job Location:
          <input
            type="text"
            name="job_location"
            value={jobData.job_location}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <br />
        <label style={styles.label}>
          Job Experience:
          <input
            type="text"
            name="job_experience"
            value={jobData.job_experience}
            onChange={handleChange}
            style={styles.input}
          />
        </label>
        <br />
        <label style={styles.label}>
          Skills (comma-separated):
          <input
            type="text"
            name="skills"
            value={jobData.skills.join(',')}
            onChange={handleSkillsChange}
            style={styles.input}
          />
        </label>
        <br />
        <button type="submit" style={styles.button}>
          Post
        </button>
      </form>
    </div>
    <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url("https://img.freepik.com/free-photo/we-are-hiring-collage_23-2150638216.jpg?w=996&t=st=1700853554~exp=1700854154~hmac=047661c53c2a582c005856b3e6135b94652cbbfaffec234d176695301398b9f8")', // Replace with your image URL
    backgroundSize: 'cover',
    filter: 'blur(10px)', // Adjust the blur as needed
    zIndex: -1, // Place the background behind other elements
  },
  heading: {
    fontSize: '28px',
    color: '#fff',
    marginBottom: '20px',
  },
  form: {
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    
    justifyContent: 'center',
    alignItems: 'center', 
  },
  formContainer: {
    zIndex: 1, 
    textAlign: 'center',
   // Ensure the form appears on top of the background
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    color: '#555',
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

export default PostJob;
