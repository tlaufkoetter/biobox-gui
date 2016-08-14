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
    db.create_all()
    role_names = ['admin', 'trusted', 'common']
    roles = []
    for role_name in role_names:
        role = models.Role.query.filter_by(name=role_name).first()
        if not role:
            role = models.Role(name=role_name)
        roles.append(role)

    if not models.User.query.filter_by(username='admin').first():
        user = models.User(
            username='admin', email='admin@admin.com'
        )
        user.hash_password('password')
        for role in roles:
            user.roles = roles
        db.session.add(user)
    db.session.commit()
