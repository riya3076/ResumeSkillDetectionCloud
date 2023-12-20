import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
    height: '90vh',
    position: 'relative',
  },
  background: {
    backgroundImage: 'url("https://img.freepik.com/free-photo/african-american-applicant-holding-resume-job-interview-close-up-view_1163-4641.jpg?w=996&t=st=1700852587~exp=1700853187~hmac=72549e095f010d871fcd310e409d80e8d61e49fbfda8c2e88834501f2b44c54a")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',  // Add a blur effect to the background
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  formContainer: {
    width: '300px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Add a semi-transparent white background to the form container
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1,  // Ensure the form is above the blurred background
  },
  formRow: {
    marginBottom: '15px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '5px',
  },
  formInput: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  formButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const correctEmail = 'riya36512@gmail.com';
  const correctPassword = 'Tech@123';
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === correctEmail && password === correctPassword) {
      navigate('/applicants');
      alert('Login successful!');
    } else {
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.formContainer}>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div style={styles.formRow}>
            <label style={styles.formLabel}>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.formInput}
              />
            </label>
          </div>

          <div style={styles.formRow}>
            <label style={styles.formLabel}>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.formInput}
              />
            </label>
          </div>

          <div style={styles.formRow}>
            <button type="submit" style={styles.formButton}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
