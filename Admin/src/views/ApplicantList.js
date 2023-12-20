import { FaExclamationCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AwsConfig from '../AWS_Config';
const AWS = require("aws-sdk");

const NoDataImage = 'https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127829.jpg?w=740&t=st=1701242337~exp=1701242937~hmac=a035f2bc4d490f8ddf0e01a5ed46947751b5a85c6763e4d9f1c8677c22482304';
const ApplicantsImage = 'https://img.freepik.com/free-vector/employees-cv-candidates-resume-corporate-workers-students-id-isolate-flat-design-element-job-applications-avatars-personal-information-concept-illustration_335657-1661.jpg?w=740&t=st=1701242568~exp=1701243168~hmac=345a1440a3ca5a94e91e905d226dba2e2026aec328e6085bf748e68f716f6e2f';

const styles = {
  container: {
    margin: '20px',
  },
  background: {
    backgroundImage: 'url("https://img.freepik.com/free-photo/african-american-applicant-holding-resume-job-interview-close-up-view_1163-4641.jpg?w=996&t=st=1700852587~exp=1700853187~hmac=72549e095f010d871fcd310e409d80e8d61e49fbfda8c2e88834501f2b44c54a")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',  
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heading: {
    fontSize: '24px',
    color: '#333',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  newJobButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'absolute',
    top: '0',
    right: '0',
    marginTop: '15px', 
    marginRight : '25px',
  },
};

const ApplicantsList = ({ history }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  AwsConfig();
  async function getApplicantList() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/getApplication";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }
  
  async function fetchData() {
    try {
      const getApplicantListURL = await getApplicantList();
      console.log(getApplicantListURL);
  
      const response = await axios.get(`${getApplicantListURL}/getApplication`);
      console.log('API Response:', response.data);
  
      setApplicants(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplicantClick = (applicantId, email) => {
    localStorage.setItem('applicantId', applicantId);
    localStorage.setItem('applicantEmail', email);
    navigate(`/applicantdetails`);
  };
  const handleNewJobClick = () => {
    navigate('/postjob');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Applicants List</h2>
      <button style={styles.newJobButton} onClick={handleNewJobClick}>
        Post New Job
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : applicants.length === 0 ? (
        <div>
          <p>No applicants found.</p>
          <img src={NoDataImage} alt="No Data" style={{ maxWidth: '500px', maxHeight: '900px' }} />
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <ul style={{ ...styles.list, width: '100%' }}>
              {applicants.map((applicant) => (
            
            <li key={applicant.applicationId} style={styles.item} onClick={() => handleApplicantClick(applicant.applicationId, applicant.email)}>
              <strong>Applicant ID:</strong> {applicant.applicationId}<br />
              <strong>Name:</strong> {applicant.name}<br />
              <strong>Email:</strong> {applicant.email}<br />
              <strong>Mobile:</strong> {applicant.mobile}<br />
              <strong>Answer:</strong> {applicant.answer}<br />
              <strong>Resume URL:</strong> <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">{applicant.resumeUrl}</a><br /><br />
              </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <img src={ApplicantsImage} alt="Applicants" style={{ maxWidth: '100%', maxHeight: '600px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;
