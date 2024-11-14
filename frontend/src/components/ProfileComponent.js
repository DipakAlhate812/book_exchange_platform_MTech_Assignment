import React, { useState, useEffect } from 'react';
import '../css/ProfileComponent.css';
import axios from 'axios';

const ProfileComponent = () => {
  const [profile, setProfile] = useState({
    email: localStorage.getItem('email'),
    location: '',
  });

  const [bookListings, setBookListings] = useState([]); // Initially an empty array
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    details: '',
    location: '',
    listed_by: localStorage.getItem('email'),
    borrow_period: '',
    request_status: '',
    request_by: localStorage.getItem('email'),
  });

  const pageData = async () => {
    // Get the email from localStorage
    const userEmail = localStorage.getItem('email');
    
    try {
      // Fetch the profile data
      const response1 = await axios.get(`http://localhost:5002/api/user-profile?email=${encodeURIComponent(userEmail)}`);
      console.log('Profile data retrieved successfully:', response1.data);
      setProfile(prevProfile => ({
        ...prevProfile,
        location: response1.data.location,  // Assuming API returns { location: 'some location' }
      }));
    } catch (error) {
      console.error('Error retrieving profile:', error);
      alert('Failed to retrieve profile.');
    }
  };

  const fetchBooks = async () => {
    const userEmail = localStorage.getItem('email');
    try {
      // Fetch book listings
      const response = await axios.get(`http://127.0.0.1:5001/api/books/search?listed_by=${encodeURIComponent(userEmail)}`);
      console.log('Book listings retrieved successfully:', response.data);
      setBookListings(response.data); // Set the book listings data
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch book listings.');
    }
  };

  useEffect(() => {
    pageData();
    fetchBooks(); // Fetch book listings on component mount
  }, []);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const response = await axios.post('http://localhost:5002/api/user-profile', profile);
        console.log('Profile updated successfully', response.data);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleBookInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const book = {
      id: bookListings.length + 1,
      title: newBook.title,
      author: newBook.author,
      genre: newBook.genre,
      location: newBook.location,
      listed_by: newBook.listed_by,
      borrow_period: newBook.borrow_period,
      request_status: "Awaiting Response",
      request_by: localStorage.getItem("email"),
    };

    try {
      const response = await axios.post('http://127.0.0.1:5001/api/add-book', book);
      console.log('Book added successfully:', response.data);
      if (response.data.message === "Success") {
        setBookListings([...bookListings, book]);
        setNewBook({ title: '', author: '', genre: '', details: '' });
        setIsModalOpen(false);
        alert('Book added successfully!');
      } else {
        alert('Failed to add the book.');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add the book.');
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAcceptRequest = async (bookId) => {
    const selectedBook = bookListings.find((book) => book.id === bookId);
  
    if (!selectedBook) {
      console.error('Book not found');
      alert('Book not found');
      return;
    }
  
    try {
      const response = await axios.patch(`http://localhost:5001/api/books/request-update`, {
        listed_by: localStorage.getItem('email'),
        title: selectedBook.title,
        request_status: 'Accepted',
      });
  
      if (response.data.message === 'Success') {
        // Update the state to reflect the new request status
        const updatedBooks = bookListings.map((book) =>
          book.id === bookId ? { ...book, request_status: 'Accepted' } : book
        );
        setBookListings(updatedBooks);
  
        console.log("Updated Books:", updatedBooks);
        alert("Request status updated to Accepted");
      } else {
        alert('Failed to update request status');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };
  
  const handleDeclineRequest = async (bookId) => {
    const selectedBook = bookListings.find((book) => book.id === bookId);
    if (!selectedBook) {
      console.error('Book not found');
      alert('Book not found');
      return;
    }
  
    
  
    try {
      const response = await axios.patch(`http://localhost:5001/api/books/request-update`, {
        listed_by: localStorage.getItem('email'),
        title: selectedBook.title,
        request_status: 'Declined',
      });
  
      if (response.data.message === 'Updated status to Declined') {
        console.log('Request status updated to Declined');

        const updatedBooks = bookListings.map((book) =>
          book.id === bookId ? { ...book, request_status: 'Declined' } : book
        );

        setBookListings(updatedBooks)

        alert("Request status updated to Declined");

      } else {
        alert('Failed to update request status');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
    
  };

  const handleDeleteRequest = async (bookId) => {
    const selectedBook = bookListings.find((book) => book.id === bookId);
    if (!selectedBook) {
      console.error('Book not found');
      alert('Book not found');
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:5001/api/delete-book`, {
        params: {
          listed_by: localStorage.getItem('email'),
          title: selectedBook.title,
        }
      });
      
      
      fetchBooks(); // Fetch book listings on component mount
      
      if (response.data.message === 'Deleted successfully') {
        // Update the state to remove the deleted book
        console.log("updatedBooks",bookListings)
        const updatedBooks = bookListings.filter((book) => book.id !== bookId);
        console.log("updatedBooks",updatedBooks)
        setBookListings(updatedBooks); // Re-set the bookListings state to exclude the deleted book
        console.log('Book deleted successfully');
      } else {
        alert('Failed to delete the book.');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete the book.');
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-heading">My Profile</h1>
      
      <div className="profile-details">
        <button className="edit-btn" onClick={handleEditClick}>
          {isEditing ? 'Save Details' : 'Edit Details'}
        </button>
        <form className="profile-form">
          <div className="profile-item">
            <strong>Email: </strong>
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-item">
            <strong>Location: </strong>
            <input
              type="text"
              name="location"
              value={profile.location}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>

      <div className="book-listings">
        <h2>My Book Listings</h2>
        <div className="add-book">
          <button onClick={handleModalToggle} className="edit-btn">Add New Book Listing</button>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Add New Book</h2>
                <form onSubmit={handleAddBook}>
                  <div className="profile-item">
                    <strong>Title: </strong>
                    <input type="text" name="title" value={newBook.title} onChange={handleBookInputChange} />
                  </div>
                  <div className="profile-item">
                    <strong>Author: </strong>
                    <input type="text" name="author" value={newBook.author} onChange={handleBookInputChange} />
                  </div>
                  <div className="profile-item">
                    <strong>Genre: </strong>
                    <input type="text" name="genre" value={newBook.genre} onChange={handleBookInputChange} />
                  </div>
                  <div className="profile-item">
                    <strong>Details: </strong>
                    <textarea name="details" value={newBook.details} onChange={handleBookInputChange} />
                  </div>
                  <div className="profile-item">
                    <strong>Location: </strong>
                    <input type="text" name="location" value={newBook.location} onChange={handleBookInputChange} />
                  </div>
                  <div className="profile-item">
                    <strong>Borrow Period: </strong>
                    <input type="text" name="borrow_period" value={newBook.borrow_period} onChange={handleBookInputChange} />
                  </div>
                  <div className="profile-item">
                    <button type="submit">Add Book</button>
                  </div>
                </form>
                <button onClick={handleModalToggle}>Close</button>
              </div>
            </div>
          )}
        </div>

        <div className="book-list">
          {bookListings.map((book) => (
            <div key={book.id} className="book-item">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.genre}</p>
              <p>{book.location}</p>
              <p>{book.borrow_period}</p>
              <p>Status: {book.request_status}</p>
              {book.request_status === 'Awaiting Response' && (
                <>
                  <button onClick={() => handleAcceptRequest(book.id)}>Accept Request</button>
                  <button onClick={() => handleDeclineRequest(book.id)}>Decline Request</button>
                </>
              )}
              <button onClick={() => handleDeleteRequest(book.id)}>Delete Book</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
