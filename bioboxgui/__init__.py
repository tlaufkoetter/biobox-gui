"""
initializes the application.
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

# imports here to avoid circular dependencies.
from bioboxgui import models
from bioboxgui.api import api
import bioboxgui.views

the_api = api
the_view = bioboxgui.views


@app.before_first_request
def create_user():
    """
    initializes the database with an admin user.

    email: admin@admin.com
    password: password

    please change the user's credentials.
    """
    db.create_all()
    role_names = ['admin', 'trusted', 'common', 'base']
    roles = []
    for role_name in role_names:
        role = models.Role.query.filter_by(name=role_name).first()
        if not role:
            role = models.Role(name=role_name)
            db.session.add(role)
        roles.append(role)
    users = models.User.query.all()
    if not users or users == []:
        user = models.User(
            username='admin', email='admin@admin.com'
        )
        user.hash_password('password')
        user.roles = roles
        db.session.add(user)
    db.session.commit()
