from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

# imports here to avoid circular dependencies.
from bioboxgui import models

user_datastore = SQLAlchemyUserDatastore(db, models.User, models.Role)
security = Security(app, user_datastore)


@app.before_first_request
def create_user():
    db.create_all()
    role_names = ['admin', 'trusted', 'common']
    roles = [user_datastore.find_or_create_role(role_name) for role_name in role_names]
    if not models.User.query.filter_by(username='admin').first():
        user = user_datastore.create_user(
            username='admin', email='admin@admin.com'
        )
        user.hash_password('password')
        for role in roles:
            user_datastore.add_role_to_user(user, role)
    db.session.commit()
