import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Cookies from 'js-cookie';

function Login() {
  const [formData, setFormData] = useState({
    username: '', // Changed from email to username
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      username: formData.username, 
      password: formData.password,
    };

    axios.post('http://localhost:3000/auth/login', requestData) 
      .then((response) => {
        if (response.data.token) { 
          localStorage.setItem('token', response.data.token); 
          Cookies.set('token', response.data.token, { expires: 7 }); 

          navigate('/home');
        } else {
          setLoginError('Login failed. Please check your credentials.');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setLoginError('Invalid credentials. Please try again.');
        } else {
          console.error('Login error:', error);
          setLoginError('An error occurred. Please try again later.');
        }
      });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleRegisterClick = () => {
    navigate('/signup'); // Navigate to the register page
  };

  return (
    <div className={`signup-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Login</h2>
      {loginError && <p className="error-message">{loginError}</p>}
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
        <button type="submit">Login</button>
        <br/>
        <button onClick={handleRegisterClick} className="register-button">
          New user?... click here to Register
        </button>
      </form>
    </div>
  );
}

export default Login;
