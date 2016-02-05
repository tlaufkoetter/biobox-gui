from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

# imports here to avoid circular dependencies.
from bioboxgui import api
from bioboxgui import views, models
