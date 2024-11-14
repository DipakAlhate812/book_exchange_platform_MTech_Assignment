from db import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class Userprofiles(db.Model):
    __tablename__ = 'user_profiles'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    profilePic = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(100), nullable=False, unique=True)

    def __repr__(self):
        return f"<User {self.username}>"