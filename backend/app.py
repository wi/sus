from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('key.json')
app = firebase_admin.initialize_app(cred)

db = firestore.client()

# Add a sample user
user_ref = db.collection("users")
# user_ref.set({
#     "email": "student@virginia.com",
#     "username": "student",
#     "points": 10,
# })

app = Flask(__name__)

@app.route("/")
def yo_world():
    docs = user_ref.stream()  # Stream all documents in the collection

    for doc in docs:
        user_data = doc.to_dict()
        print(f"User ID: {doc.id}, User data: {user_data}")

    return docs

@app.route("/world")
def hello_world():
    return "<p>Hello, World!</p>"