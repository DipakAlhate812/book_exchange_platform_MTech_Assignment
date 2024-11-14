import React, { useState, useEffect } from 'react';
import '../css/SearchTable.css';
import axios from 'axios';

const SearchTable = () => {
  const [data, setData] = useState([]);
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/api/books');
        setData(response.data); // Set the data after the response is resolved
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };
    fetchData();
  }, []);

  // Filter the data based on search inputs
  const handleSearch = () => {
    return data.filter((item) => {
      const matchesAuthor = searchAuthor === '' || item.author.toLowerCase().includes(searchAuthor.toLowerCase());
      const matchesGenre = searchGenre === '' || item.genre.toLowerCase().includes(searchGenre.toLowerCase());
      const matchesLocation = searchLocation === '' || item.location.toLowerCase().includes(searchLocation.toLowerCase());
      const matchesTitle = searchTitle === '' || item.title.toLowerCase().includes(searchTitle.toLowerCase());
      return matchesAuthor && matchesGenre && matchesLocation && matchesTitle;
    });
  };

  const filteredBooks = handleSearch();

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handleResetRequest = () => {
    setSearchAuthor('');
    setSearchTitle('');
    setSearchLocation('');
    setSearchGenre('');
  };

  const handleRequest = async (book) => {
    const requestedByEmail = localStorage.getItem("email"); // Retrieve the email from localStorage
    
    if (!requestedByEmail) {
      alert('You must be logged in to request a book');
      return;
    }

    // Create the request payload with only the requested_by details
    const updatedBook = {
      ...book,
      request_by: requestedByEmail // Add the email to the book's requested_by field
    };
    console.log("updatedBook", updatedBook)
    try {
      // Send a POST request to update the book entry with the requested_by details
      const response = await axios.post('http://127.0.0.1:5001/api/update-book', updatedBook);

      // Check if the request was successful
      if (response.status === 200) {
        alert(`Request to borrow the book "${book.title}" has been sent.`);
      } else {
        alert('Failed to send request. Please try again.');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('An error occurred while sending the request.');
    }
  };

  return (
    <div className="container">
      <h2>Search Books</h2>
      <div className="search-fields">
        <input
          type="text"
          placeholder="Search by Author"
          value={searchAuthor}
          onChange={(e) => setSearchAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Genre"
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />

        <button onClick={handleResetRequest} className="request-button">
          Reset Search
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Location</th>
            <th>Listed By</th>
            <th>Borrow Period</th>
            <th>Raise Request</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.location}</td>
              <td>{book.listed_by}</td>
              <td>{book.borrow_period}</td>
              <td>
                <button onClick={() => handleRequest(book)} className="request-button">
                  Request
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchTable;
