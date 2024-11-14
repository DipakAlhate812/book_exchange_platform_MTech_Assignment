import React, { useState } from 'react';
import axios from 'axios';
import '../css/auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track if OTP is sent

  // Function to send OTP to the provided email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      console.log(email)
      const response = await axios.post('http://127.0.0.1:5000/auth/send-otp', { email });
      console.log(response.status)

      if (response.status === 200) {
        setIsOtpSent(true);
        alert('OTP sent to your email!');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  // Function to handle the password reset with email, OTP, and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const resetData = {
      email: email,
      otp: otp,
      password: password,
    };
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/reset-password', resetData);
      if (response.status === 200) {
        alert('Password has been reset successfully!');
        // Optionally, redirect to the login page
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please check your OTP and try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Book Exchange Platform</h2>
        <h2>Reset Password</h2>
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className="login-btn"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>

          {isOtpSent && (
            <>
              <div className="input-group">
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter OTP"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="newpassword">New Password</label>
                <input
                  type="password"
                  id="newpassword"
                  placeholder="New Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </>
          )}

          <div className="login-options">
            <p>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
