from flask import Blueprint, request, jsonify, make_response
from models import Book
from db import db  # Import the db from the new fileimport jwt
import datetime
import os
import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.urandom(24).hex()

@auth_bp.route('/')
def hello_world():
    return 'Hello, World!'

# Sign-up route
# Route to add a new book (POST request)
@auth_bp.route('/books', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def add_books():
    data = request.get_json()
    # Validate incoming data
    if not all(key in data for key in ['title', 'author', 'genre', 'location', 'listed_by', 'borrow_period', 'request_status', 'request_by']):
        return jsonify({'message': 'Missing fields'}), 400

    # Create a new book instance
    new_book = Book(
        title=data['title'],
        author=data['author'],
        genre=data['genre'],
        location=data['location'],
        listed_by=data['listed_by'],
        borrow_period=data['borrow_period'],
        request_status=data['request_status'],
        request_by=data['request_by']
    )

    # Add and commit the new book to the database
    db.session.add(new_book)
    db.session.commit()

    return jsonify({'message': 'Book added successfully'}), 201

# Route to get all books (GET request)
@auth_bp.route('/books', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
def get_books():
    books = Book.query.all()
    books_data = []
    for book in books:
        books_data.append({
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'location': book.location,
            'listed_by': book.listed_by,
            'borrow_period': book.borrow_period,
            'request_status': book.request_status,
            'request_by': book.request_by
        })
    return jsonify(books_data), 200

# Route to get books by genre and author (GET request)
@auth_bp.route('/books/search', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
def get_books_by_params():
    # Retrieve query parameters from the URL
    # title = request.args.get('title')  # 'genre' is the query parameter for genre
    listed_by = request.args.get('listed_by')  # 'author' is the query parameter for author
    # Query the database for books that match the parameters
    books = Book.query.filter_by(listed_by=listed_by).all()

    # If no books are found
    if not books:
        return jsonify({'message': 'No books found matching the provided criteria'}), 404

    # Prepare the data to return
    books_data = []
    for book in books:
        books_data.append({
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'location': book.location,
            'listed_by': book.listed_by,
            'borrow_period': book.borrow_period,
            'request_status': book.request_status,
            'request_by': book.request_by
        })

    return jsonify(books_data), 200

# API to handle raise request and send email
@auth_bp.route('/raise-request', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def raise_request():
    data = request.json
    
    # Extract the details from the request
    to_email = data.get('to')
    subject = data.get('subject')
    message_content = data.get('message')
    
    if not to_email or not subject or not message_content:
        return jsonify({'error': 'Invalid data received'}), 400
    
    # try:
        # Send email (update the SMTP server and credentials accordingly)
        # Email sender configuration
    from_email = 'Enter Your Email'  # Replace with your email
    password = "Enter Email Password"  # Use your Gmail App Password

    # Email content
    message = MIMEMultipart("alternative")
    message['Subject'] = subject
    message['From'] = from_email
    message['To'] = to_email

    part1 = MIMEText(subject, "plain")
    message.attach(part1)

     # Connect to Gmail's SMTP server and send the email
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(from_email, password)
    server.sendmail(from_email, to_email, subject.as_string())
    server.quit()
    return jsonify({'success': True, 'message': 'Request email sent successfully!'}), 200
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500
    

# Backend Route to Handle the Book Creation
@auth_bp.route('/add-book', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def add_book():
    try:
        data = request.get_json()
        # Extract the book data from the request
        new_book = Book(
            title=data['title'],
            author=data['author'],
            genre=data['genre'],
            location=data['location'],
            listed_by=data['listed_by'],
            borrow_period=data['borrow_period'],
            request_status=data['request_status'],
            request_by=data['request_by']
        )

        # Add the new book to the database
        db.session.add(new_book)
        db.session.commit()

        # Return the newly added book data
        return jsonify({
            'message': "Success",
            'id': new_book.id,
            'title': new_book.title,
            'author': new_book.author,
            'genre': new_book.genre,
            'location': new_book.location,
            'listed_by': new_book.listed_by,
            'borrow_period': new_book.borrow_period
        }), 201
    except:
         return jsonify({
            'message': "Error occured.",
        }), 201
    
# Endpoint to update book with requested_by
@auth_bp.route('/update-book', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def update_book():
    try:
        # Get the book data from the request
        data = request.get_json()
        # Extract the book ID and requested_by details
        listed_by = data.get('listed_by')
        title = data.get('title')
        requested_by = data.get('request_by')
        # Find the book by its ID
        book = Book.query.filter_by(listed_by=listed_by, title=title).first()

        if book:
            # Update the requested_by field
            book.request_by = requested_by

            # Commit the changes to the database
            db.session.commit()

            return jsonify({"message": "Book request has been updated successfully!"}), 200
        else:
            return jsonify({"message": "Book not found!"}), 404

    except Exception as e:
        return jsonify({"message": "An error occurred while updating the book."}), 500


@auth_bp.route('/books', methods=['GET'])
@cross_origin(origins="http://localhost:3000")
def get_books_by_email():
    # Get the email parameter from the query string
    # email = request.args.get('email')
    email="user@example.com"

    if not email:
        return jsonify({'message': 'Email query parameter is required'}), 400

    
    # Query the database for books listed by the provided email
    books = Book.query.filter(Book.listed_by == email).all()    

    if not books:
        return jsonify({'message': 'No books found for the provided email'}), 404

    # Create a list of dictionaries to return in the response
    book_list = []
    for book in books:
        book_data = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'genre': book.genre,
            'location': book.location,
            'listed_by': book.listed_by,
            'borrow_period': book.borrow_period,
            'request_status': book.request_status,
            'request_by': book.request_by
        }
        book_list.append(book_data)

    return jsonify(book_list), 200

@auth_bp.route('/books/request-update', methods=['PATCH'])
@cross_origin(origins="http://localhost:3000")
def update_book_request_status():
    # Get the request body data
    data = request.get_json()

    # Log the incoming data for debugging

    # Extract values from the request body
    listed_by = data.get('listed_by')
    title = data.get('title')
    request_status = data.get('request_status')

    # Check if all required data is provided
    if not listed_by or not title or not request_status:
        return jsonify({"message": "Missing required fields"}), 400
    
    # Initialize query to find the book by listed_by and title
    book = Book.query.filter_by(listed_by=listed_by, title=title).first()

    # If no book is found, return an error response
    if not book:
        return jsonify({"message": "Book not found"}), 404

    # Update the request status of the book
    book.request_status = request_status
    db.session.commit()

    # Return success message with updated status
    return jsonify({"message": f"Updated status to {request_status}"}), 200

@auth_bp.route('/delete-book', methods=['DELETE'])
@cross_origin(origins="http://localhost:3000")
def delete_book_listing():
    # Get the query parameters from the request JSON
    listed_by = request.args.get('listed_by')  # Query parameter for 'listed_by'
    title = request.args.get('title')  # Query parameter for 'title'

    # Check if both parameters are provided
    if not listed_by or not title:
        return jsonify({"message": "Listed by and title are required"}), 400

    # Find the book in the database based on listed_by and title
    book = Book.query.filter_by(listed_by=listed_by, title=title).first()

    # Check if the book exists
    if not book:
        return jsonify({"message": "Book not found"}), 404

    # Delete the book listing from the database
    try:
        db.session.delete(book)
        db.session.commit()
        return jsonify({"message": "Deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error deleting book listing: {str(e)}"}), 500
