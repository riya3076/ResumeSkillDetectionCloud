import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AwsConfig from '../AWS_Config';
const AWS = require("aws-sdk");

const ApplicantDetails = () => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [expectedSkills, setExpectedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const applicantId = localStorage.getItem('applicantId');

  AwsConfig();

  async function getApplicantDetails() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/applicantdetails";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getApplicantDetailURL = await getApplicantDetails();
        console.log(getApplicantDetailURL);
        if (applicantId) {
          const response = await axios.post(
            `${getApplicantDetailURL}/applicantdetails`,
            { applicationId: applicantId }
          );

          console.log('Response:', response.data);

          setExpectedSkills(response.data.matchingSkills);
          setResumeUrl(response.data.resumeUrl);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        toast.error('Error fetching data. Please try again.');
      }
    };

    fetchData();
  }, [applicantId]);

  AwsConfig();

  async function sendMail() {
    try {
      const ssm = new AWS.SSM();
      const parameterName = "/sendMail";
      const parameter = await ssm.getParameter({ Name: parameterName, WithDecryption: false }).promise();
      return parameter.Parameter.Value;
    } catch (error) {
      console.error("Error fetching API Gateway URL from SSM Parameter Store:", error);
      return "https://flippingbook.com/404";
    }
  }

  const sendMailForInterview = async () => {
    try {
      const sendMailURL = await sendMail();
      console.log(sendMailURL);
      if (applicantId) {
        const response = await axios.post(
          `${sendMailURL}/SendMail`,
          { email: localStorage.getItem('applicantEmail')}
        );

        if (response.status === 200) {
          console.log(response);
          toast.success('Email sent successfully!');
        } else {
          console.log(response);
          toast.error('Error sending email. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        {applicantId && (
          <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
            <h3>Resume</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {resumeUrl ? (
                  <iframe title="Resume" src={resumeUrl} width="100%" height="600px"></iframe>
                ) : (
                  <p>No resume available</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        {applicantId && (
          <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h3>Matched Skills</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {expectedSkills?.length > 0 ? (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {expectedSkills?.map((skill, index) => (
                      <li key={index} style={{ marginBottom: '8px', fontSize: '16px' }}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No expected skills available</p>
                )}
              </>
            )}
            <button onClick={sendMailForInterview} style={{ marginTop: '20px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}>Send Mail for Interview</button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ApplicantDetails;
