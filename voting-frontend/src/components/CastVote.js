import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CastVote.css';

const CastVote = ({ setMessage }) => {
  const [voterId, setVoterId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [message, setMessageState] = useState('');
  const [messageType, setMessageType] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [dropdownOpened, setDropdownOpened] = useState(false); // Track if the dropdown is open

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${apiUrl}/candidates`);
      const uniqueCandidates = [...new Set(response.data)]; // Remove duplicates
      const sortedCandidates = uniqueCandidates.filter(c => c !== "").sort(); // Remove empty and sort
      setCandidates(sortedCandidates);  // Set the list of candidates
    } catch (error) {
      setMessageState('Failed to load candidates.');
      setMessageType('error');
    }
  };

  useEffect(() => {
    if (dropdownOpened) {
      fetchCandidates(); // Fetch candidates when the dropdown is opened
    }
  }, [dropdownOpened]); // Refetch candidates when dropdown is toggled

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
        
        {/* Dropdown for selecting candidate */}
        <select 
          value={candidateId} 
          onChange={(e) => setCandidateId(e.target.value)} 
          className="input-field"
          onClick={() => setDropdownOpened(true)} // Set dropdown as opened when clicked
          onBlur={() => setDropdownOpened(false)} // Set dropdown as closed when losing focus
        >
          <option value="">Select Candidate</option>
          {candidates.map((candidate) => (
            <option key={candidate} value={candidate}>
              {candidate}
            </option>
          ))}
        </select>

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
