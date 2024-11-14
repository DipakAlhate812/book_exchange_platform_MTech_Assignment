# Book Exchange Platform

## Overview
The **Book Exchange Platform** is a web-based application that allows users to list, browse, and manage book exchanges. The platform enables users to:
- Create and update their profile
- List books available for exchange
- Request books from other users
- Accept or decline book requests
- Delete book listings

The backend is built using Flask API for managing books and user profiles, while the frontend is built using React for a seamless user experience.

## Features
- **User Profile Management**: Users can view and update their profiles, including email and location.
- **Book Listings**: Users can add, view, update, and delete book listings.
- **Book Searching**: Users can search and request book listings.


## Technologies Used
- **Frontend**: React, Axios for API requests
- **Backend**: Flask, SQLAlchemy (for database operations)
- **Database**: SQLite 
- **Authentication**: Token-based authentication (JWT )
- **CSS**: Custom CSS for frontend styling

## Installation

### Prerequisites
- Node.js and npm
- Python 3.x
- Flask
- SQLite or MongoDB (depending on your choice)
Refer requirements.txt and package.json for depenedencies

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/book-exchange-platform.git
   cd book-exchange-platform


### API Endpoint Documentation
# User Profile API

## API Endpoints

1. Get User Profile by Email

- **Route**: `/user-profile`
- **Method**: `GET`
- **Description**: Get user profile by email.
- **Parameters**: 
  - Query Parameter: `email` (string, required)
- **Request Body**: N/A
- **Response Codes**:
  - `200`: Success
  - `400`: Missing email
  - `404`: User not found
- **Response Example**:
  ```json
  {
    "username": "JohnDoe",
    "email": "john.doe@example.com",
    "location": "New York"
  }

2. Create or Update User Profile

    Route: /user-profile
    Method: POST
    Description: Create or update user profile.
    Parameters: N/A
    Request Body:

{
  "username": "JaneDoe",
  "email": "jane.doe@example.com",
  "age": 28,
  "location": "Los Angeles",
  "profilePic": "https://example.com/profile-pic.jpg"
}

Response Codes:

    201: Created/Updated
    400: Invalid input
    500: Server error

Response Example:

    {
      "message": "User profile created/updated successfully",
      "user": {
        "username": "JaneDoe",
        "email": "jane.doe@example.com",
        "location": "Los Angeles",
        "profilePic": "https://example.com/profile-pic.jpg"
      }
    }

3. Delete User Profile by Email

    Route: /user-profile
    Method: DELETE
    Description: Delete user profile by email.
    Parameters:
        Query Parameter: email (string, required)
    Request Body: N/A
    Response Codes:
        200: Success
        400: Missing email
        404: User not found
    Response Example:

    {
      "message": "User with email john.doe@example.com deleted successfully"
    }

4. Get All User Profiles

    Route: /user-profiles
    Method: GET
    Description: Get all user profiles.
    Parameters: N/A
    Request Body: N/A
    Response Codes:
        200: Success
        404: No profiles
        500: Server error
    Response Example:

    [
      {
        "email": "john.doe@example.com",
        "location": "New York",
        "profilePic": "https://via.placeholder.com/50"
      },
      {
        "email": "jane.doe@example.com",
        "location": "Los Angeles",
        "profilePic": "https://via.placeholder.com/50"
      }
    ]

5. Delete All User Profiles

    Route: /user-profiles
    Method: DELETE
    Description: Delete all user profiles.
    Parameters: N/A
    Request Body: N/A
    Response Codes:
        200: Success
        500: Server error
    Response Example:

{
  "message": "Deleted 3 users from the database"
}


# Authentication API

## API Endpoints

### 1. User Signup

- **Route**: `/signup`
- **Method**: `POST`
- **Description**: User signup.
- **Parameters**: None
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string"
  }

    Response Codes:
        201: User created
        400: Missing fields
        409: User already exists
    Response Example:

    {
      "message": "User created successfully"
    }

2. User Login

    Route: /login
    Method: POST
    Description: User login.
    Parameters: None
    Request Body:

{
  "email": "string",
  "password": "string"
}

Response Codes:

    200: Login successful
    401: Invalid credentials

Response Example:

    {
      "token": "jwt_token",
      "refresh_token": "jwt_token"
    }

3. Send OTP for Password Reset

    Route: /send-otp
    Method: POST
    Description: Send OTP for password reset.
    Parameters: None
    Request Body:

{
  "email": "string"
}

Response Codes:

    200: OTP sent
    404: User not found
    500: Failed to send OTP

Response Example:

    {
      "message": "OTP sent successfully",
      "otp": "123456"
    }

4. Reset User Password

    Route: /reset-password
    Method: POST
    Description: Reset user password.
    Parameters: None
    Request Body:

{
  "email": "string",
  "otp": "string",
  "password": "string"
}

Response Codes:

    200: Password reset successful
    400: Invalid OTP
    404: User not found

Response Example:

    {
      "message": "Password has been reset successfully"
    }

5. Delete User by ID

    Route: /user/<int:user_id>
    Method: DELETE
    Description: Delete user by ID.
    Parameters:
        Path Parameter: user_id (int, required)
    Request Body: None
    Response Codes:
        200: User deleted
        404: User not found
    Response Example:

    {
      "message": "User and associated tokens deleted successfully"
    }

6. User Logout

    Route: /logout
    Method: POST
    Description: User logout.
    Parameters: None
    Request Body: None
    Response Codes:
        200: Logout successful
        400: Token not found
        500: Server error
    Response Example:

{
  "message": "Logout successful"
}

# Book Management API

## API Endpoints

### 1. Add a New Book

- **Route**: `/books`
- **Method**: `POST`
- **Description**: Add a new book.
- **Parameters**: None
- **Request Body**:
  ```json
  {
    "title": "book1",
    "author": "author1"
  }

    Response Codes:
        201: Book added successfully
        400: Missing fields
    Response Example:

    {
      "message": "Book added successfully"
    }

2. Get All Books

    Route: /books
    Method: GET
    Description: Get all books.
    Parameters: None
    Request Body: None
    Response Codes:
        200: OK
    Response Example:

    [
      {
        "title": "book1",
        "author": "author1"
      }
    ]

3. Get Books by Listed By

    Route: /books/search
    Method: GET
    Description: Get books by listed_by.
    Parameters: Query Parameter: listed_by (string, required)
    Request Body: None
    Response Codes:
        200: OK
        404: No books found
    Response Example:

[
  {
    "title": "book1",
    "author": "author1"
  }
]

Or

    {
      "message": "No books found matching the provided criteria"
    }

4. Send Email for Raising Request

    Route: /raise-request
    Method: POST
    Description: Send email for raising a request.
    Parameters: None
    Request Body:

{
  "to": "recipient@example.com",
  "subject": "subject",
  "message": "content"
}

Response Codes:

    200: Request email sent successfully
    400: Invalid data received

Response Example:

{
  "success": true,
  "message": "Request email sent successfully!"
}

Or

    {
      "error": "Invalid data received"
    }

5. Add a Book and Return Its Details

    Route: /add-book
    Method: POST
    Description: Add a book and return its details.
    Parameters: None
    Request Body:

{
  "title": "book1",
  "author": "author1"
}

Response Codes:

    201: Book added successfully
    400: Missing fields

Response Example:

    {
      "message": "Success",
      "id": 1,
      "title": "book1"
    }

6. Update the Request By Field of a Book

    Route: /update-book
    Method: POST
    Description: Update the request_by field of a book.
    Parameters: None
    Request Body:

{
  "listed_by": "email@example.com",
  "title": "book1",
  "request_by": "requester1"
}

Response Codes:

    200: Book request updated successfully
    404: Book not found

Response Example:

{
  "message": "Book request has been updated successfully!"
}

Or

    {
      "message": "Book not found!"
    }

7. Update the Request Status Field of a Book

    Route: /books/request-update
    Method: PATCH
    Description: Update the request_status field of a book.
    Parameters: None
    Request Body:

{
  "listed_by": "email@example.com",
  "title": "book1",
  "request_status": "requested"
}

Response Codes:

    200: Status updated successfully
    400: Bad request
    404: Book not found

Response Example:

{
  "message": "Updated status to requested"
}

Or

    {
      "message": "Book not found"
    }

8. Delete a Book by Listed By and Title

    Route: /delete-book
    Method: DELETE
    Description: Delete a book by listed_by and title.
    Parameters: Query Parameters: listed_by (string, required), title (string, required)
    Request Body: None
    Response Codes:
        200: Deleted successfully
        400: Bad request
        404: Book not found
    Response Example:

{
  "message": "Deleted successfully"
}

Or

{
  "message": "Book not found"
}