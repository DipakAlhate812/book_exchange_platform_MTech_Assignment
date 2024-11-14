from db import db

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    genre = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    listed_by = db.Column(db.String(255), nullable=False)
    borrow_period = db.Column(db.Integer, nullable=False)
    request_status = db.Column(db.String(255), nullable=False)
    request_by = db.Column(db.String(255), nullable=False)




