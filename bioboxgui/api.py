from functools import wraps

from flask import g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from flask_restful import Api, abort, reqparse
from itsdangerous import SignatureExpired, BadSignature

from bioboxgui import app, models

api = Api(app)
basic_auth = HTTPBasicAuth()
auth = HTTPTokenAuth()


def roles_accepted(*roles):
    def wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            for role in g.user.roles:
                if role.name in roles:
                    break
            else:
                abort(403)
            return f(*args, **kwargs)

        return decorated

    return wrapper


from bioboxgui.resources import bioboxes, interfaces, tasks, sources, users

request_parser = reqparse.RequestParser()
request_parser.add_argument(
    'email',
    type=str,
    required=True,
    help='No email provided',
    location='json'
)
request_parser.add_argument(
    'password',
    type=str,
    required=True,
    help='No password provided',
    location='json'
)


@auth.verify_token
def verify_token(token):
    user = None
    try:
        user = models.User.verify_auth_token(token)
    except SignatureExpired:
        abort(401)  # valid token, but expired
    except BadSignature:
        abort(401)  # invalid token
    if not user:
        return False
    g.user = user
    return True


@basic_auth.verify_password
def verify_password(email, password):
    if not email or not password:
        user_request = request_parser.parse_args()
        email = user_request['email']
        password = user_request['password']
    user = models.User.query.filter_by(email=email).first()
    if not user or not user.verify_password(password):
        return False
    g.user = user
    return True


api.add_resource(bioboxes.BioboxesAll,
                 '/bioboxgui/api/bioboxes')
api.add_resource(bioboxes.BioboxId,
                 '/bioboxgui/api/bioboxes/<int:biobox_id>')
api.add_resource(bioboxes.BioboxName,
                 '/bioboxgui/api/bioboxes/<string:biobox_name>')
api.add_resource(interfaces.Interfaces,
                 '/bioboxgui/api/interfaces')
api.add_resource(tasks.TasksAll,
                 '/bioboxgui/api/tasks')
api.add_resource(tasks.TaskId,
                 '/bioboxgui/api/tasks/<string:task_id>')
api.add_resource(sources.SourcesAll,
                 '/bioboxgui/api/sources')
api.add_resource(users.UserName,
                 '/bioboxgui/api/users/<string:username>')
api.add_resource(users.UserAll,
                 '/bioboxgui/api/users')
api.add_resource(users.UserLogin,
                 '/bioboxgui/api/token')
