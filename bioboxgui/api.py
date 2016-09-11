"""
defines the REST API.
"""
from functools import wraps

from flask import g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from flask_restful import Api, abort, reqparse
from itsdangerous import SignatureExpired, BadSignature

from bioboxgui import app, models
from config import API_VERSION as version

api = Api(app)
basic_auth = HTTPBasicAuth()
auth = HTTPTokenAuth()


def roles_accepted(*roles):
    """
    custom wrapper to check if the currently logged in user has the requierd
    permissions.

    :param *roles: the roles of which the user has to have at least one
    """
    def wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            for role in g.user.roles:
                if role.name in roles:
                    break
            else:
                print(role.name)
                print(roles)
                print([ro.name for ro in g.user.roles])
                abort(403)
            return f(*args, **kwargs)

        return decorated

    return wrapper


from bioboxgui.resources import bioboxes, interfaces, tasks, sources, users

# parsing log in data from the post body.
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
    """
    Custom method to verify the given token.

    :param token: the token with which the user is authenticated
    :return: a 401 error if the token is invalid or expired
    """
    print('token')
    user = None
    try:
        user = models.User.verify_auth_token(token)
    except (SignatureExpired, BadSignature) as e:
        abort(401)  # valid token, but expired or invalid token
    if not user:
        return False
    g.user = user
    return True


@basic_auth.verify_password
def verify_password(email, password):
    """
    Custom method to verify the login data of a user.

    :param email: the user's email
    :param password: the user's password
    :return: 404 error if the user doesn't exist or wrong credentials were given
    """
    if not email or not password:
        # necessary because we're using basic authentication
        user_request = request_parser.parse_args()
        email = user_request['email']
        password = user_request['password']
    user = models.User.query.filter_by(email=email).first()
    if not user or not user.verify_password(password):
        abort(404)
    g.user = user
    return True


# performing actions on all the bioboxes
api.add_resource(
    bioboxes.BioboxesAll,
    '/bioboxgui/api/{}/bioboxes'.format(version)
)

# performing actions on one biobox by id
api.add_resource(
    bioboxes.BioboxId,
    '/bioboxgui/api/{}/bioboxes/<int:biobox_id>'.format(version)
)

# performing actions on one biobox by name
api.add_resource(
    bioboxes.BioboxName,
    '/bioboxgui/api/{}/bioboxes/<string:biobox_name>'.format(version)
)

# performing actions on all the interfaces
api.add_resource(
    interfaces.Interfaces,
    '/bioboxgui/api/{}/interfaces'.format(version)
)

# performing actions on all the tasks
# requires jobproxy, mesos scheduler and mesos to run
api.add_resource(
    tasks.TasksAll,
    '/bioboxgui/api/{}/tasks'.format(version)
)

# performing actions on one task by id
# requires jobproxy, mesos scheduler and mesos to run
api.add_resource(
    tasks.TaskId,
    '/bioboxgui/api/' + version + '/tasks/<string:task_id>'
)

# performing actions on all the sources
api.add_resource(
    sources.SourcesAll,
    '/bioboxgui/api/' + version + '/sources'
)

# performing actions on one source by name
api.add_resource(
    sources.SourceName,
    '/bioboxgui/api/' + version + '/sources/<string:name>'
)

# performing actions on one user by name
api.add_resource(
    users.UserName,
    '/bioboxgui/api/' + version + '/users/<string:username>'
)

# performing actions on all the users
api.add_resource(
    users.UserAll,
    '/bioboxgui/api/' + version + '/users'
)

# acquire/delete authentication token
api.add_resource(
    users.UserLogin,
    '/bioboxgui/api/' + version + '/token'
)

# performing actions on the input files
api.add_resource(
    bioboxes.InputFiles,
    '/bioboxgui/api/' + version + '/files'
)
