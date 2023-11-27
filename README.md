# AIServices.pro
A lightweight SaaS platform that leverages OpenAI to execute specialized tasks using prompt-engineered approaches.

## Usage

### Home (Familiar look, with preset services)
![aiservices - home screen](https://github.com/ShoaibKhan/AIServices.pro/blob/main/design/v1.0/aiservices%20-%20home%20screen.png)

### Chat screen
![aiservices - loading screen](https://github.com/ShoaibKhan/AIServices.pro/blob/main/design/v1.0/aiservices%20-%20loading%20screen.png)

![aiservices - reply screen](https://github.com/ShoaibKhan/AIServices.pro/blob/main/design/v1.0/aiservices%20-%20reply%20screen.png)


## Installation

Install with pip:

```
$ pip install -r requirements.txt
```

## Flask Application Structure 
```
.
|────static/
| |────css/
| | |────main.css
| |────js/
| | |────script.js
| |────input.css
|────templates/
| |────index.html
|────main.py
|────requirements.txt
|────tailwind.config.js

```

## Flask Configuration

#### Importing Secret Keys from .env file

```
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import openai
import os

load_dotenv()

app = Flask(__name__ )
# Flask-PyMongo configuration
app.config["MONGO_URI"] = os.getenv('MONGO_URI')
app.secret_key = os.getenv('SECRET_KEY')
mongo = PyMongo(app)
openai.api_key = os.getenv('OPENAI_API_KEY')
```

#### .env example

```

# MongoDB
MONGO_URI="mongodb+srv://user:password@cluster-url/database-name?retryWrites=true&w=majority"

# Flask Secret Key
SECRET_KEY='your-secret-key'

# OpenAI API Key
OPENAI_API_KEY="your-openai-api-key"

# Flask App Config
FLASK_APP=run.py

# Flask Environment
FLASK_ENV=development  # development/production

# Flask Debug Mode
# Set to 1 to enable debug mode, 0 to disable it
FLASK_DEBUG=1

```

#### Builtin Configuration Values

SERVER_NAME: the name and port number of the server. 

JSON_SORT_KEYS : By default Flask will serialize JSON objects in a way that the keys are ordered.

- [reference¶](http://flask.pocoo.org/docs/0.12/config/)

 
## Run Flask
### Run flask for develop
```
$ python main.py
```
In flask, Default port is `5000`

AIServices document page:  `http://127.0.0.1:5000/api`

### Run flask for production

** Run with gunicorn **

In  aiservices.pro/

```
$ gunicorn -w 4 -b 127.0.0.1:5000 main:app
```

* -w : number of worker
* -b : Socket to bind

## Reference

Offical Website

- [Flask](http://flask.pocoo.org/)
- [Flask Extension](http://flask.pocoo.org/extensions/)
- [gunicorn](http://gunicorn.org/)

Tutorial

- [Flask Overview](https://www.slideshare.net/maxcnunes1/flask-python-16299282)
- [In Flask we trust](http://igordavydenko.com/talks/ua-pycon-2012.pdf)

[Wiki Page](https://github.com/tsungtwu/flask-example/wiki)