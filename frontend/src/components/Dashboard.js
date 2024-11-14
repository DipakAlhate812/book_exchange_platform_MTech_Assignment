import React, { useState } from 'react';
import '../css/dashboard.css';
import SearchTable from './ExploreBooks';
import UserProfileListing from './UserProfileListing';
import ProfileComponent from './ProfileComponent';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 



const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');  // Get the token from local storage

      // If token is found, send a logout request to the server
      if (token) {
        await axios.post('http://127.0.0.1:5000/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Clear the token from local storage after successful logout
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');

        // Redirect the user to the login page
        navigate('/login');
      } else {
        console.log('No token found in local storage.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <ul>
          <li className={activeTab === 'Home' ? 'active' : ''} onClick={() => setActiveTab('Home')}>Explore Books</li>
          <li className={activeTab === 'Profile' ? 'active' : ''} onClick={() => setActiveTab('Profile')}>User Profiles</li>
          <li className={activeTab === 'myprofile' ? 'active' : ''} onClick={() => setActiveTab('myprofile')}>My Profile</li>
          <li className={activeTab === 'Logout' ? 'active' : ''} onClick={handleLogout}>Log Out</li>
        </ul>
      </div>
      <div className="content">
          {activeTab === 'Home' && (
              <div>
                <SearchTable></SearchTable>
              </div>
            )}
          {activeTab === 'Profile' && (
              <div>
                <UserProfileListing />              
              </div>
            )}
          {activeTab === 'myprofile' && (
              <div>
                <ProfileComponent />              
              </div>
            )}

      </div>
    </div>
  );
};

export default Dashboard;
