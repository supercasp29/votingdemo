import React, { useState } from 'react';
import axios from 'axios';
import './CastVote.css';

const CastVote = ({ setMessage }) => {
  const [voterId, setVoterId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [message, setMessageState] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const castVote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/vote`, { voter_id: voterId, candidate_id: candidateId });
      setMessageState(response.data.message);
      setMessageType('success');
      setVoterId('');
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
    <div className="cast-vote-container">
      <h2 className="cast-vote-title">Cast Vote</h2>
      <form onSubmit={castVote} className="cast-vote-form">
        <input 
          type="text" 
          value={voterId} 
          onChange={(e) => setVoterId(e.target.value)} 
          placeholder="Enter Voter ID" 
          className="input-field"
        />
        <input 
          type="text" 
          value={candidateId} 
          onChange={(e) => setCandidateId(e.target.value)} 
          placeholder="Enter Candidate ID" 
          className="input-field"
        />
        <button type="submit" className="submit-btn">Cast Vote</button>
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

export default CastVote;
