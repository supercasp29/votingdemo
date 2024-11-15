import React, { useState, useEffect } from 'react';
import RegisterVoter from './components/RegisterVoter';
import RegisterCandidate from './components/RegisterCandidate';
import CastVote from './components/CastVote';
import Results from './components/Results';
import './App.css';

const App = () => {
  const [message, setMessage] = useState('');

  // Automatically hide the message after 10 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 10000); // 10 seconds
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [message]);

  return (
    <div className="app-container">
      <div className="form-container">
        <RegisterVoter setMessage={setMessage} />
        <RegisterCandidate setMessage={setMessage} />
        <CastVote setMessage={setMessage} />
        <Results />
      </div>
      {message && (
        <div className="message-container">
          <div className="message">{message}</div>
        </div>
      )}
    </div>
  );
};

export default App;
