import base64
import os
import uuid

import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request

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
    
#     alternatives = get_alternatives("plastic water bottle")

#     return jsonify({
#         "message": "Image uploaded and saved successfully.",
#         "post_id": doc_ref.id,
#         "image_url": image_url,
#         "alt1": alternatives[0],
#         "alt2": alternatives[1],
#         "alt1": alternatives[2],
        
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