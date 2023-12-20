import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './views/WelcomePage';
import JobOpeningsPage from './views/JobOpeningsPage';
import ApplyPage from './views/ApplyPage';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<WelcomePage/> }/>
      <Route path="/job-openings" element={<JobOpeningsPage/> }/>
      <Route path="/apply/:jobId" element={<ApplyPage/> }/>
    </Routes>
  </Router>
  );
}

export default App;
