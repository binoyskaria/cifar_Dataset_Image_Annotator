import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [duplicateEmailError, setDuplicateEmailError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    is_admin: false,
  });
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setDuplicateEmailError("Passwords do not match.");
      return;
    }

    const requestData = {
      username: formData.username,
      password: formData.password,
    };

    const url =  'http://localhost:3000/auth/register' ;

    axios
      .post(url, requestData)
      .then((result) => {
        console.log('Registration successful:', formData);
        navigate('/login');
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 409) {
          setDuplicateEmailError('Username already exists. Please use a different username.');
        } else {
          setDuplicateEmailError('An error occurred during registration.');
        }
      });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginClick = ()=>{
    navigate('/login');;
  }
  return (
    <div className={`signup-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Sign Up</h2>
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={handleLoginClick}>Already have an Account? Login</button>
      {duplicateEmailError && <p className="error-message">{duplicateEmailError}</p>}
    </div>
  );
}

export default Signup;
