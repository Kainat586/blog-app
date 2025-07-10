from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.utils import secure_filename
import os
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity, verify_jwt_in_request
)
from pymongo import MongoClient
from bson import ObjectId
import datetime

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['JWT_SECRET_KEY'] = 'Sx4tVd8@!wJ93pLzB2qFz7GkYhNm9TqW'
jwt = JWTManager(app)

client = MongoClient("mongodb+srv://kainatkhuram786:uni285@cluster0.abi2z7r.mongodb.net/blogDB?retryWrites=true&w=majority")
db = client["blogDB"]
posts = db["posts"]
users = db["users"]

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/media/<filename>")
def get_media(filename):
    print("Serving:", filename)
    print("Full path:", os.path.join(app.config["UPLOAD_FOLDER"], filename))
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/")
def home():
    return jsonify({"message": "Blog API is running"}), 200

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400
    hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    users.insert_one({"email": data["email"], "password": hashed})
    return jsonify({"message": "Signup successful"}), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = users.find_one({"email": data["email"]})
    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        token = create_access_token(identity=str(user["_id"]), expires_delta=datetime.timedelta(hours=1))
        return jsonify({"token": token}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/posts", methods=["GET"])
def get_posts():
    user_only = request.args.get("userOnly", "false").lower() == "true"
    email = None
    user_id = None

    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        user = users.find_one({"_id": ObjectId(user_id)})
        email = user["email"] if user else None
    except:
        pass

    if user_only and user_id:
        query = {"user_id": user_id}
    else:
        query = {}

    fetched_posts = list(posts.find(query))
    for post in fetched_posts:
        post["_id"] = str(post["_id"])
        post["author"] = post.get("author", "Unknown")
        post["date"] = post.get("date", None)

    return jsonify({
        "posts": fetched_posts,
        "email": email
    })

@app.route("/api/my-posts", methods=["GET"])
@jwt_required()
def get_my_posts():
    user_id = get_jwt_identity()
    user_posts = list(posts.find({"user_id": user_id}))
    
    for post in user_posts:
        post["_id"] = str(post["_id"])
        post["author"] = post.get("author", "Unknown")
        post["date"] = post.get("date", None)

    return jsonify(user_posts)

# @app.route("/media/<filename>")
# def get_media(filename):
#     return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/api/posts", methods=["POST"])
@jwt_required()
def add_post():
    user_id = get_jwt_identity()
    user = users.find_one({"_id": ObjectId(user_id)})
    author = user["email"].split("@")[0] if user and "email" in user else "Unknown"

    title = request.form.get("title")
    content = request.form.get("content")
    file = request.files.get("media")

    media_url = None
    if file:
        filename = secure_filename(file.filename)
        upload_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        # If file with same name exists, make filename unique
        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(upload_path):
            filename = f"{base}_{counter}{ext}"
            upload_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            counter += 1

        file.save(upload_path)
        media_url = f"/media/{filename}"

    post = {
        "title": title,
        "content": content,
        "author": author,
        "date": datetime.datetime.now().isoformat(),
        "media": media_url,
        "user_id": user_id
    }

    post_id = posts.insert_one(post).inserted_id
    return jsonify({"_id": str(post_id), "media": media_url}), 201


@app.route("/api/posts/<id>", methods=["PUT"])
@jwt_required()
def update_post(id):
    data = request.json
    data.pop("user_id", None)
    data.pop("date", None)
    posts.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "Post updated"})

@app.route("/api/posts/<id>", methods=["DELETE"])
@jwt_required()
def delete_post(id):
    posts.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Post deleted"})

if __name__ == "__main__":
    app.run(debug=True)
