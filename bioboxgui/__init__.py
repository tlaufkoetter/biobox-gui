from flask import Flask
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from flask_sqlalchemy import SQLAlchemy
from flask_security import SQLAlchemyUserDatastore, Security

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

# imports here to avoid circular dependencies.
from bioboxgui import views, models

user_datastore = SQLAlchemyUserDatastore(db, models.User, models.Role)
security = Security(app, user_datastore)
from bioboxgui import api


@app.before_first_request
def create_user():
    db.create_all()
    role = user_datastore.find_or_create_role('admin')
    if not models.User.query.filter_by(username='admin').first():
        user = user_datastore.create_user(
            username='admin', email='admin@admin.com', password='password'
        )
        user_datastore.add_role_to_user(user, role)
    db.session.commit()
