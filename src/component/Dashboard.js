import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');
  const username = sessionStorage.getItem('user');
  const [charCount, setCharCount] = useState(0);

  // Load all tweets when component mounts
  useEffect(() => {
    const storedTweets = JSON.parse(localStorage.getItem('tweets')) || [];
    setTweets(storedTweets);
  }, []);

  const handleTweet = (e) => {
    e.preventDefault();
    if (newTweet.trim() && newTweet.length <= 280) {
      const newTweetObj = {
        id: Date.now(),
        text: newTweet,
        author: username,
        timestamp: new Date().toLocaleString()
      };
      
      // Update both state and localStorage
      const updatedTweets = [newTweetObj, ...tweets];
      setTweets(updatedTweets);
      localStorage.setItem('tweets', JSON.stringify(updatedTweets));
      
      setNewTweet('');
      setCharCount(0);
    }
  };

  const handleTweetChange = (e) => {
    const text = e.target.value;
    setNewTweet(text);
    setCharCount(text.length);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="user-info">
            <h1>Hello, {username}</h1>
            <p>What's on your mind today?</p>
          </div>
          <Link 
            to="/" 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Link>
        </header>
        
        <div className="tweet-composer">
          <form onSubmit={handleTweet}>
            <textarea 
              value={newTweet}
              onChange={handleTweetChange}
              placeholder="Share your thoughts..."
              maxLength="280"
              className="tweet-textarea"
            />
            <div className="tweet-actions">
              <span 
                className={`char-count ${charCount > 270 ? 'warning' : ''}`}
              >
                {charCount}/280
              </span>
              <button 
                type="submit"
                className="tweet-button"
                disabled={!newTweet.trim() || newTweet.length > 280}
              >
                Tweet
              </button>
            </div>
          </form>
        </div>

        <div className="tweets-container">
          {tweets.length === 0 ? (
            <div className="no-tweets">
              <p>No tweets yet. Start sharing!</p>
            </div>
          ) : (
            tweets.map((tweet) => (
              <div 
                key={tweet.id} 
                className={`tweet-item ${tweet.author === username ? 'own-tweet' : ''}`}
              >
                <div className="tweet-author">{tweet.author}</div>
                <p>{tweet.text}</p>
                <small>{tweet.timestamp}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;