import React, { useState } from 'react';
import axios from 'axios';
import './RegisterVoter.css';

const RegisterVoter = ({ setMessage }) => {
  const [voterId, setVoterId] = useState('');
  const [message, setMessageState] = useState('');
  const [messageType, setMessageType] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const registerVoter = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register/voter`, { voter_id: voterId, name: 'Voter Name' });
      setMessageState(response.data.message);
      setMessageType('success');
      setVoterId('');

      setTimeout(() => {
        setMessageState('');
      }, 10000);

    } catch (error) {
      setMessageState(error.response?.data?.message || 'An unexpected error occurred.');
      setMessageType('error');

      setTimeout(() => {
        setMessageState('');
      }, 10000);
    }
  };

  return (
    <div className="register-voter-container">
      <h2 className="register-title">Register Voter</h2>
      <form onSubmit={registerVoter} className="register-form">
        <input 
          type="text" 
          value={voterId} 
          onChange={(e) => setVoterId(e.target.value)} 
          placeholder="Enter Voter ID" 
          className="input-field"
        />
        <button type="submit" className="submit-btn">Register Voter</button>
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

export default RegisterVoter;
