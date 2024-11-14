from flask import Blueprint, request, jsonify, make_response
from models import Userprofiles
from db import db  # Import the db from the new fileimport jwt
import os
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.urandom(24).hex()



@auth_bp.route('/user-profile', methods=['GET'])
def get_user_profile():
    email = request.args.get('email')  # Get email from query parameter
    if not email:
        return jsonify({"error": "Email parameter is missing"}), 400
    
    # Query the database for the user profile with the given email
    user_profile = Userprofiles.query.filter_by(email=email).first()
    
    if user_profile:
        # Return the user's location in the response
        return jsonify({
            'username': user_profile.username,
            'email': user_profile.email,
            'location': user_profile.location
        }), 200
    else:
        # Return an error if the user with the provided email is not found
        return jsonify({"error": "User not found"}), 404

# Entry creation request
@auth_bp.route('/user-profile', methods=['POST'])
def create_or_update_user_profile():
    data = request.get_json()  # Get JSON data from request body
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Check if a user with the provided email already exists
    user_profile = Userprofiles.query.filter_by(email=email).first()

    if user_profile:
        # If user exists, update their details
        user_profile.username = data.get('username', user_profile.username)
        user_profile.location = data.get('location', user_profile.location)
    else:
        # If user does not exist, create a new one
        user_profile = Userprofiles(
            username=data['username'],
            age=data['age'],
            location=data['location'],
            profilePic=data.get('profilePic'),
            email=data['email']
        )
        db.session.add(user_profile)  # Add new user profile

    # Save changes to the database
    db.session.commit()

    return jsonify({
        'message': 'User profile created/updated successfully',
        'user': {
            'username': user_profile.username,
            'age': user_profile.age,
            'location': user_profile.location,
            'profilePic': user_profile.profilePic,
            'email': user_profile.email
        }
    }), 201

# delete single user profile
@auth_bp.route('/user-profile', methods=['DELETE'])
def delete_user_profile():
    email = request.args.get('email')  # Get email from query parameter
    if not email:
        return jsonify({"error": "Email parameter is missing"}), 400

    # Find the user profile by email
    user_profile = Userprofiles.query.filter_by(email=email).first()

    if user_profile:
        db.session.delete(user_profile)
        db.session.commit()
        return jsonify({"message": f"User with email {email} deleted successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Delete all user profiles
@auth_bp.route('/user-profiles', methods=['DELETE'])
def delete_all_user_profiles():
    try:
        num_rows_deleted = db.session.query(Userprofiles).delete()
        db.session.commit()
        return jsonify({"message": f"Deleted {num_rows_deleted} users from the database"}), 200
    except:
        db.session.rollback()
        return jsonify({"error": "Failed to delete user profiles"}), 500

# Endpoint to get user profile details by email
# Route to fetch all user profiles
@auth_bp.route('/user-profiles', methods=['GET'])
def get_all_user_profile():
    try:
        # Query all user profiles from the database
        user_profiles = Userprofiles.query.all()
        
        # Check if any profiles are found
        if user_profiles:
            # Format the response as a list of profiles
            profiles_data = []
            for user_profile in user_profiles:
                profiles_data.append({
                    'email': user_profile.email,
                    'location': user_profile.location,
                    'profilePic': user_profile.profilePic or 'https://via.placeholder.com/50'  # Use a placeholder if profilePic is None
                })
            
            # Return the list of profiles as JSON
            return jsonify(profiles_data), 200
        else:
            # Return an error if no user profiles are found
            return jsonify({"error": "No user profiles found"}), 404

    except Exception as e:
        # Return an error if something goes wrong
        return jsonify({"error": str(e)}), 500