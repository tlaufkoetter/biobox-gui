from flask import Flask
from flask_bootstrap import Bootstrap
app = Flask(__name__)
Bootstrap(app)

from bioboxgui import api
from bioboxgui import views
