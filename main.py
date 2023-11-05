from flask import Flask, request, session, jsonify, render_template
from flask_pymongo import PyMongo
import openai
import uuid
import re

app = Flask(__name__)

# Flask-PyMongo configuration
app.config["MONGO_URI"] = "mongodb+srv://Shoaib:S1k3ebox@aiservices.ac58mky.mongodb.net/aiservices"
app.secret_key = 'S1k3ebox'
mongo = PyMongo(app)
openai.api_key = "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"


@app.route("/")
def index():
    user_id = session.get('userID')

    if not user_id:
        user_id = str(uuid.uuid4())
        session['userID'] = user_id

    if not mongo.db.users.find_one({"user_id": user_id}):
        mongo.db.users.insert_one({"user_id": user_id, "chats": []})

    myChats = mongo.db.users.find_one({"user_id": user_id}).get('chats', [])
    return render_template("index.html", myChats=myChats)

@app.route("/api", methods=["POST"])
def qa():
    user_id = session.get('userID')
    question = clean_text(request.json['question'])
    response = openai.ChatCompletion.create( # Prompt OpenAI
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
    answer_content = response["choices"][0]["message"]["content"]
    data = {"question": question, "answer": response["choices"][0]["message"]}
    mongo.db.users.update_one(
        {"user_id": user_id},
        {"$push" : {"chats": [question, answer_content]}}
    )
    return jsonify(data)

def clean_text(text): # Clean text for better results
    text = text.strip()
    text = re.sub(r'\s+', ' ', text)
    text = text.replace("\\'", "'").replace("→", "")
    return text

app.run(debug=True, port=5001)