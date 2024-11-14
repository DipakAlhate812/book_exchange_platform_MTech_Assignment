// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/auth.css';
import { useNavigate } from 'react-router-dom'; 
import Login from './Login';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State to hold the error message
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);  // Track registration status

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (password1 !== password2) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      const signupData = {
        name: username,
        email: email,
        password: password1,
      };
      console.log("signupData:", signupData);

      const response = await axios.post('http://127.0.0.1:5000/auth/signup', signupData);

      console.log("response:", response);
      if (response.status === 201) {
        // Registration was successful, update the state to show the login component
        setRegistrationSuccess(true);
      }
      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('User already exists or required field is missing');
        console.log("User already exists or required field is missing");

      } else {
        setErrorMessage('Signup failed. Please try again later.');
        console.log("Signup failed. Please try again later.");

      }
      console.error('Signup failed:', error);
    }
    
  };

  return (
    <>
      {/* If registration is successful, render the Login component */}
      {registrationSuccess ? (
        <Login />
      ) : (
        <div className="login-container">
          <div className="login-box">
            <h2>Book Exchange Platform</h2>
            <h2>User Registration</h2>
            <form className="login-form" onSubmit={handleRegistration}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" placeholder="Enter your name" required value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required value={password1} onChange={(e) => setPassword1(e.target.value)} />
              </div>
              <div className="input-group">
                <label htmlFor="password">Confirm Password</label>
                <input type="password" id="password" placeholder="Enter your password" required value={password2} onChange={(e) => setPassword2(e.target.value)} />
              </div>
              {errorMessage && (
                <p style={{ color: 'red' }}>{errorMessage}</p>
              )}
              <button type="submit" className="login-btn">Register</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default Register;


