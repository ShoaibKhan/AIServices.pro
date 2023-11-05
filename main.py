from flask import Flask, request, session, jsonify, render_template
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import openai
import uuid
import re
import os

load_dotenv()

# Create Flask application instance
app = Flask(__name__)

# Flask-PyMongo configuration
app.config["MONGO_URI"] = os.getenv('MONGO_URI')
app.secret_key = os.getenv('SECRET_KEY')
mongo = PyMongo(app)
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route("/")
def index():
    """
    Home route that initializes a user session and displays the chat interface.
    """
    user_id = session.get('userID')

    # Create a new user session if one does not exist
    if not user_id:
        user_id = str(uuid.uuid4())
        session['userID'] = user_id

    # Insert a new user into the database if they do not exist
    if not mongo.db.users.find_one({"user_id": user_id}):
        mongo.db.users.insert_one({"user_id": user_id, "chats": []})

    # Retrieve the user's chat history
    my_chats = mongo.db.users.find_one({"user_id": user_id}).get('chats', [])
    return render_template("index.html", myChats=my_chats)

@app.route("/api", methods=["POST"])
def qa():
    """
    API endpoint for processing a question and generating an answer using OpenAI.
    """
    user_id = session.get('userID')
    question = clean_text(request.json['question'])

    # Generate a response using OpenAI
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
            "role": "user",
            "content": question
            }
        ],
        temperature=1,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    # Extract answer from response and store the question and answer in the database
    answer_content = response["choices"][0]["message"]["content"]
    data = {"question": question, "answer": response["choices"][0]["message"]}
    mongo.db.users.update_one(
        {"user_id": user_id},
        {"$push" : {"chats": [question, answer_content]}}
    )
    return jsonify(data)

def clean_text(text):
    """
    Cleans the input text to ensure better processing by OpenAI.
    
    :param text: The text to be cleaned.
    :return: The cleaned text.
    """
    text = text.strip()
    text = re.sub(r'\s+', ' ', text)
    text = text.replace("\\'", "'").replace("→", "")
    return text

app.run(debug=True, port=5001)