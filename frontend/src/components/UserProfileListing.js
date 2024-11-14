import React, { useState, useEffect } from 'react';
import '../css/UserProfile.css';
import axios from 'axios';

const UserProfileListing = () => {
    const [users, setUsers] = useState([]); // Renamed setUser to setUsers for clarity
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch data from API on component mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5002/api/user-profiles');
          setUsers(response.data); // Set the data after the response is resolved
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching the data', error);
        }
      };
      fetchData();
    }, []);

    // Handle user click to show profile details
    const handleUserClick = (user) => {
      setSelectedUser(user);
    };

    return (
      <div className="user-profile-container">
        <h1>User Profile Listing</h1>
        
        <div className="profile-layout">
          {/* User list on the left side */}
          <div className="user-list">
            {users.map((user) => (
              <div
                key={user.id} // Ensuring unique key for each user
                className="user-card"
                onClick={() => handleUserClick(user)}
              >
                <div className="user-card-header">
                  {/* Fallback image if profilePic is not available */}
                  <img 
                    src={'https://via.placeholder.com/50'} 
                    className="profile-pic" 
                  />
                  <h5>{user.email}</h5>
                </div>
              </div>
            ))}
          </div>

          {/* User Detail View on the right side */}
          {selectedUser && (
            <div className="user-detail">
              <h2>Details for {selectedUser.email}</h2>
              <p><strong>Location:</strong> {selectedUser.location}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
            </div>
          )}
        </div>
      </div>
    );
};

export default UserProfileListing;
