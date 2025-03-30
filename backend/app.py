import base64
import os
import uuid

import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request
from datetime import datetime

# from openai import OpenAI

# database
cred = credentials.Certificate('key.json')
app = firebase_admin.initialize_app(cred)

db = firestore.client()
user_ref = db.collection("users")

# openai
#client = OpenAI()

#flask app
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "static/uploads"

@app.route("/")
def yo_world():
    
    docs = user_ref.order_by(
        "sustainability_score",
        direction=firestore.Query.DESCENDING
    ).stream()

    users_list = []
    for doc in docs:
        user_data = doc.to_dict()

        # Extract fields (use get(...) for safety)
        user_name = user_data.get("username", "invalid")
        user_email = user_data.get("email", "Unknown")
        score = user_data.get("sustainability_score", 0)

        # Build a dictionary for each user
        user_dict = {
            "id": doc.id,
            "username": user_name,
            "email": user_email,
            "sustainability_score": score
        }
        users_list.append(user_dict)

    # Return as JSON
    return jsonify(users_list), 200

@app.route("/world")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/create_post', methods=['POST'])
def create_post():
    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({"error": "no image field in request"}), 400

    # 1) Decode Base64 image
    base64_image = data["image"]
    try:
        image_data = base64.b64decode(base64_image)
    except Exception as e:
        return jsonify({"error": f"Failed to decode base64 string. {str(e)}"}), 400

    # 2) Save the file
    filename = f"{uuid.uuid4()}.png"
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    try:
        with open(file_path, 'wb') as f:
            f.write(image_data)
    except Exception as e:
        return jsonify({"error": f"Could not write file. {str(e)}"}), 500

    image_url = f"/static/uploads/{filename}"

    # 3) Find the user with the highest score
    try:
        top_user_query = user_ref.order_by(
            "sustainability_score",
            direction=firestore.Query.DESCENDING
        ).limit(1).stream()

        top_user_doc = next(top_user_query, None)
        if not top_user_doc:
            return jsonify({"error": "No users found in database"}), 404

        highest_user_id = top_user_doc.id
        highest_user_data = top_user_doc.to_dict()
    except Exception as e:
        return jsonify({"error": f"Error fetching top user. {str(e)}"}), 500

    # 4) Add 10 points to that user’s sustainability score
    try:
        new_score = highest_user_data.get("sustainability_score", 0) + 10
        user_ref.document(highest_user_id).update({
            "sustainability_score": new_score
        })
    except Exception as e:
        return jsonify({"error": f"Error updating user score. {str(e)}"}), 500

    # 5) Create a new post in Firestore
    try:
        posts_ref = db.collection('posts')
        post_data = {
            "user_id": highest_user_id,
            "image_url": image_url,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "filename": filename,
        }
        
        print("post data", post_data)
        
        post_doc_ref = posts_ref.document()
        post_doc_ref.set(post_data)

        # Build final return object
        post_response = {
            "post_id": post_doc_ref.id,
            "user_id": highest_user_id,
            "image_url": image_url,
            "filename": filename,
            "timestamp": datetime.now(),
            "new_user_score": new_score
        }
    except Exception as e:
        return jsonify({"error": f"Error creating post doc. {str(e)}"}), 500

    # 6) Return the newly created post info
    return jsonify({
        "message": "Post created successfully",
        **post_response
    }), 200

@app.route('/latest_post', methods=['GET'])
def get_latest_post():
    try:
        # Query your "posts" collection, sorting by "timestamp" descending
        post_query = db.collection('posts') \
                       .order_by("timestamp", direction=firestore.Query.DESCENDING) \
                       .limit(1) \
                       .stream()
        
        print("latest dock", post_query)
        latest_doc = next(post_query, None)  # get the first doc, if any
        if not latest_doc:
            return jsonify({"error": "No posts available"}), 404


        print("latest dock", latest_doc.to_dict())
        
        latest_post = latest_doc.to_dict()
        return jsonify(latest_post), 200

    except Exception as e:
        return jsonify({"error": f"Error fetching latest post: {str(e)}"}), 500
    
    
# @app.route('/upload', methods=['POST'])
# def upload():
#     data = request.get_json()
#     if not data or "image" not in data:
#         return jsonify({"error": "no image field in request"}), 400
    
#     base64_image = data["image"]
    
#     ## decode
#     try:
#         image_data = base64.b64decode(base64_image)
#     except Exception as e:
#         return jsonify({"error": f"Failed to decode base64 string. {str(e)}"}), 400

#     # Generate a unique filename (we'll default to .png; adapt if you want to detect file type)
#     filename = f"{uuid.uuid4()}.png"
#     file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

#     # Ensure the upload folder exists
#     os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

#     # Write the decoded bytes to the file in the static/uploads folder
#     try:
#         with open(file_path, 'wb') as f:
#             f.write(image_data)
#     except Exception as e:
#         return jsonify({"error": f"Could not write file. {str(e)}"}), 500

#     # The public (or relative) URL. If you're serving static files normally,
#     # you can typically access it at: /static/uploads/<filename>
#     image_url = f"/static/uploads/{filename}"

#     # (Optional) Store a record in Firestore
#     doc_ref = db.collection('posts').document()
#     doc_data = {
#         "image_url": image_url,
#         "filename": filename,
#         # more fields if you like
#     }
#     doc_ref.set(doc_data)
    
#     # alternatives = get_alternatives("plastic water bottle")

#     return jsonify({
#         "message": "Image uploaded and saved successfully.",
#         "post_id": doc_ref.id,
#         "image_url": image_url,
#     }), 200
    
# def get_alternatives(label):
#     prompt = (f'''You are an expert on carbon emissions. 
#               For {label} suggest three alternatives that are more
#               sustainable, only list the options, no other text or
#               explainations.''')
    
#     try:
#         response = client.responses.create(
#             model="gpt-4o",
#             input=prompt
#         )
        
#         response = response.content.strip().split('\n')
#         response = [res.strip('- ').strip().lstrip('0123456789. ')
#                     for res in response if res.strip()]
        
#         return response
#     except Exception as e:
#         return "error calling gpt"