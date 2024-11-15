import React, { useState } from 'react';
import axios from 'axios';
import './Results.css';  // New CSS file for custom styling

const Results = () => {
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState(''); // Add local state for message

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const getResults = async () => {
    setMessage('Fetching results...');
    try {
      const response = await axios.get(`${apiUrl}/results`);
      const resultsData = Object.entries(response.data).map(([candidateId, votes]) => ({
        candidate_id: candidateId,
        votes: votes,
      }));
      setResults(resultsData);
      setMessage(''); // Clear the message after fetching results
    } catch (error) {
      setMessage(error.response?.data?.message || 'An unexpected error occurred.');
      setResults(null);
    }
  };

  return (
    <div className="results-container">
      <h2>Voting Results</h2>
      <button className="btn results-btn" onClick={getResults}>Get Results</button>
      
      {/* Display the message */}
      {message && <p className="message">{message}</p>}

      {/* Show results if available */}
      {results && results.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.candidate_id}</td>
                <td>{result.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results available</p>
      )}
    </div>
  );
};

export default Results;
