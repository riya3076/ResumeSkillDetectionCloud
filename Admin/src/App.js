import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css';
import Login from './Auth/login';
import ApplicantsList from './views/ApplicantList';
import ApplicantDetails from './views/ApplicantDetails';
import PostJob from './views/PostJob';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path ='/applicants' element = {<ApplicantsList/>}/>
        <Route path = '/applicantdetails' element = {< ApplicantDetails/>}/>
        <Route path = '/postjob' element = {< PostJob />}/>
      </Routes>
    </Router>
  );
}

export default App;
