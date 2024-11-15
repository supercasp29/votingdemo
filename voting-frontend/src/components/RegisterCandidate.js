import React, { useState } from 'react';
import axios from 'axios';
import './RegisterCandidate.css';

const RegisterCandidate = ({ setMessage }) => {
  const [candidateId, setCandidateId] = useState('');
  const [message, setMessageState] = useState('');
  const [messageType, setMessageType] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const registerCandidate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register/candidate`, { candidate_id: candidateId, name: 'Candidate Name' });
      setMessageState(response.data.message);
      setMessageType('success');
      setCandidateId('');

      // Clear the message after 10 seconds
      setTimeout(() => {
        setMessageState('');
      }, 10000);
    } catch (error) {
      setMessageState(error.response?.data?.message || 'An unexpected error occurred.');
      setMessageType('error');

      // Clear the message after 10 seconds
      setTimeout(() => {
        setMessageState('');
      }, 10000);
    }
  };

  return (
    <div className="register-candidate-container">
      <h2 className="register-title">Register Candidate</h2>
      <form onSubmit={registerCandidate} className="register-form">
        <input 
          type="text" 
          value={candidateId} 
          onChange={(e) => setCandidateId(e.target.value)} 
          placeholder="Enter Candidate ID" 
          className="input-field"
        />
        <button type="submit" className="submit-btn">Register Candidate</button>
      </form>

      {/* Display message */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default RegisterCandidate;
