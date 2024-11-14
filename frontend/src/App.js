// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ProtectedRoute  from './components/ProtectedRoute';
import './css/dashboard.css'; // Add your custom component styles
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* protected routes */}
        <Route path="/dashboard" 
                element={<ProtectedRoute element={<Dashboard />} />} 
        />

      
      </Routes>
    </Router>
  );
}

export default App;
