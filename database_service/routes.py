from flask import Blueprint, request, jsonify, make_response
from models import User, Token
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
def generate_otp():
    return random.randint(100000, 999999)

# Sign-up route
@auth_bp.route('/signup', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def signup():
    data = request.get_json()
    if not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing fields'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if user:
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(
        name=data['name'],
        email=data['email'],
    )

    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


# Login route
@auth_bp.route('/login', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def login():
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        # Generate JWT tokens
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        }, SECRET_KEY)

        refresh_token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, SECRET_KEY)

        # Save tokens to the database
        new_token = Token(user_id=user.id, token=token, refresh_token=refresh_token)
        db.session.add(new_token)
        db.session.commit()

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'refresh_token': refresh_token
        }), 200
    
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# forgot-password route
# Forgot password route
@auth_bp.route('/send-otp', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def forgot_password():
    data = request.get_json()
    if not data.get('email'):
        return jsonify({'message': 'Email field is missing'}), 400

    # Look for the user by email
    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'message': 'User with this email does not exist'}), 404
     # Generate OTP and expiration time
    otp = generate_otp()
    otp_expiration = datetime.datetime.utcnow() + datetime.timedelta(minutes=2)  # OTP valid for 5 minutes

    # Store the OTP and expiration in the Token table (or a separate OTP table if needed)
    new_token = Token(user_id=user.id, 
                      token="saasxa",  
                      refresh_token="xasxasxa",
                      otp=str(otp), 
                      otp_expires_at=otp_expiration) 
   
    db.session.add(new_token)
    db.session.commit()

    # Send OTP via email
    try:
        sender_email = "Enter your email"  # Replace with your Gmail address
        receiver_email = data['email']
        password = "Enter Your password"  # Use your Gmail App Password

        # Email content
        message = MIMEMultipart("alternative")
        message["Subject"] = "Your OTP for Password Reset"
        message["From"] = sender_email
        message["To"] = receiver_email

        # Email body (plain text and HTML)
        text = f"Hi, your OTP for password reset is: {otp}\nThis OTP is valid for 5 minutes."
        html = f"""\
        <html>
        <body>
            <p>Hi,<br>
            Your OTP for password reset is:<br>
            <strong>{otp}</strong><br>
            This OTP is valid for 5 minutes.
            </p>
        </body>
        </html>
        """
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")

        message.attach(part1)
        message.attach(part2)

        # Connect to Gmail's SMTP server and send the email
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())
        server.quit()

    except Exception as e:
        return jsonify({'message': 'Failed to send OTP email', 'error': str(e)}), 500

    return jsonify({
        'message': 'OTP sent successfully. Please check your email.',
        'otp': otp  # For testing purposes, you can remove this in production
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
@cross_origin(origins="http://localhost:3000")
def reset_password():
    data = request.get_json()
    if not data.get('email') or not data.get('otp') or not data.get('password'):
        return jsonify({'message': 'Email, OTP, and new password fields are required'}), 400

    # Look for the user by email
    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'message': 'User with this email does not exist'}), 404
    # Look for the OTP and validate it
    otp_entry = Token.query.filter_by(user_id=user.id, otp=data['otp']).first()
    if not otp_entry.otp or otp_entry.otp_expires_at < datetime.datetime.utcnow():
        return jsonify({'message': 'Invalid or expired OTP'}), 400

    # Update the user's password
    user.password = user.set_password(data['password'])  # Replace with your password hashing logic

    db.session.commit()

    return jsonify({'message': 'Password has been reset successfully'}), 200


# API to delete a user by ID
@auth_bp.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Find the user by ID
    user = User.query.get(user_id)
    
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)
    
    try:
        # First, delete all associated tokens
        Token.query.filter_by(user_id=user_id).delete()
        
        # Then, delete the user
        db.session.delete(user)
        db.session.commit()
        
        return make_response(jsonify({"message": "User and associated tokens deleted successfully"}), 200)
    
    except Exception as e:
        db.session.rollback()  # Rollback if something goes wrong
        return make_response(jsonify({"error": str(e)}), 500)
    
@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        # Extract the token from the request headers (assuming it's a Bearer token)
        token = request.headers.get('Authorization').split()[1]
        
        # Find the token in the database
        token_entry = Token.query.filter_by(token=token).first()

        if token_entry:
            # Delete the token from the database
            db.session.delete(token_entry)
            db.session.commit()
            return jsonify({"message": "Logout successful, token removed from server"}), 200
        else:
            return jsonify({"error": "Token not found"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500