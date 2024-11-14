import '../css/auth.css';
import React, { useState } from 'react';
import axios from 'axios';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loginError, setLoginError] = useState('');  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
      email: username,
      password: password
      };
      const response = await axios.post('http://127.0.0.1:5000/auth/login', loginData);
      setToken(response.data.token);
      localStorage.setItem('email', username);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh_token)
      
      console.log('token', response.data.token);

      console.log('refresh_token', response.data.refresh_token);

      console.log('Login successful:');
      setLoginError('');  // Set error message
      if (response.status === 200) {
        window.location.href = '/dashboard';  // Or navigate('/login');
      }
    } catch (error) {
      setLoginError('User does not exist or incorrect credentials');  // Set error message
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
    
  };

  return (
    <>
    <div className="login-container">
      <div className="login-box">
      <h2>Book Exchange Platform</h2>
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          
          <div className="input-group">
            <label htmlFor="email" >Email</label>
            <input type="email" 
            id="email" 
            placeholder="Enter your email" 
            required value={username} 
            onChange={(e) => setUsername(e.target.value)} />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" >Password</label>
            <input type="password" 
            id="password" 
            placeholder="Enter your password" 
            required value={password} 
            onChange={(e) => setPassword(e.target.value)}/>
          </div>
          
          <button type="submit" className="login-btn">Login</button>
          
          <div className="login-options">
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>
        
        </form>
        {loginError && (
            <p style={{ color: 'red' }}>{loginError}</p>  
          )}
      </div>
    </div>
    </>
  );
}

export default Login;

