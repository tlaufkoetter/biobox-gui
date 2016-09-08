from flask import abort, g
from flask_restful import Resource, marshal, reqparse, fields
from itsdangerous import BadSignature, SignatureExpired

from bioboxgui import models, db
from bioboxgui.api import auth, basic_auth, roles_accepted

regular_role = {
    'name': fields.String,
    'description': fields.String
}

regular_user = {
    'username': fields.String,
    'email': fields.String,
    'roles': fields.List(fields.Nested(regular_role))
}

regular_token = {
    'token': fields.String,
    'roles': fields.List(fields.String)
}


class UserName(Resource):
    """
    Access a single user by their name.
    """
    def __init__(self):
        """creates the reqparser.
        """
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'roles',
            type=list,
            required=False,
            help='the users roles',
            location='json'
        )
        self.reqparse.add_argument(
            'username',
            type=str,
            required=False,
            help='the new name of the user. should be unique',
            location='json'
        )
        self.reqparse.add_argument(
            'email',
            type=str,
            required=False,
            help='the new email adress of the user. should be unique',
            location='json'
        )

    @auth.login_required
    def get(self, username):
        """
        Get a user by their name.

        The accessor has either to be the same user as the one they are
        trying to access or be an admin

        :param username: name of the user that shall be received.
        :return: a json formatted user with roles.
        """
        if not g.user.username == username and "admin" not in g.user.roles:
            abort(403)
        user = models.User.query.filter_by(
            username=username
        ).first()
        if not user:
            abort(404)
        return marshal(user, regular_user)

    @auth.login_required
    @roles_accepted('admin')
    def put(self, username):
        """Updates the given user.

        :param username: name of the user that is to be changed
        :returns: the updated json formatted user
        """
        user = models.User.query.filter_by(
            username=username
        ).first()
        if not user:
            abort(404)
        arguments = self.reqparse.parse_args()
        new_username = arguments.get('username')
        new_email = arguments.get('email')
        new_roles = arguments.get('role')

        if new_username and new_username is not '':
            user.username = new_username
        if new_email and new_email is not '':
            user.email = new_email
        if new_roles and new_roles is not []:
            actual_roles = []
            for new_role in new_roles:
                role = models.Role.query.filter_by(name=new_role).first()
                if role:
                    actual_roles.append(role)
                else:
                    break
            else:
                abort(404)
            user.roles = actual_roles

        db.session.add(user)
        db.session.commit()

        return marshal(user, regular_user, envelope='user')

    @auth.login_required
    @roles_accepted('admin')
    def delete(self, username):
        """
        Delete a user by their name.

        :param username: name of the user to be deleted.
        :return: None
        """
        user = models.User.query.filter_by(
            username=username
        ).first()
        if not user:
            abort(404)
        db.session.delete(user)
        db.session.commit()
        return None, 204


class UserAll(Resource):
    """
    Access the whole user pool
    """
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'username',
            type=str,
            required=True,
            help='No username provided',
            location='json'
        )
        self.reqparse.add_argument(
            'email',
            type=str,
            required=True,
            help='No email provided',
            location='json'
        )
        self.reqparse.add_argument(
            'password',
            type=str,
            required=True,
            help='No password provided',
            location='json'
        )
        super(UserAll, self).__init__()

    @auth.login_required
    @roles_accepted('admin')
    def get(self):
        """
        Queries the whole user list.
        :return: list of json formatted users.
        """
        users = models.User.query.all()
        return marshal(users, regular_user)

    @auth.login_required
    @roles_accepted('admin')
    def post(self):
        """
        Creates a new user.

        Params in the post data.

        :param username: username must be unique.
        :param email: email must be unique.
        :param password: better be strong.
        """
        user_request = self.reqparse.parse_args()
        username = user_request['username']
        password = user_request['password']
        email = user_request['email']
        if username is None or password is None:
            abort(400)  # missing arguments
        if models.User.query.filter_by(username=username).first() is not None:
            abort(400)  # existing user
        user = models.User(
            username=username,
            email=email,
            roles=[models.Role.query.filter_by(name='base').first()]
        )
        user.hash_password(password)
        db.session.add(user)
        db.session.commit()

        return marshal(user, regular_user), 201


class UserLogin(Resource):
    """
    Accesses the user session.
    """
    @basic_auth.login_required
    def post(self):
        """
        Generates a authentication token.

        Login data has to be provided in the post data.

        :param email: login via email adress.
        :param password: better be the right one.
        """
        try:
            token = g.user.generate_auth_token()
        except SignatureExpired | BadSignature:
            abort(401)  # token valid or expired
        return marshal({
            'token': token.decode('ascii'),
            'roles': [role.name for role in g.user.roles]
        }, regular_token), 200

    @auth.login_required
    def delete(self):
        """
        Ends the user's session.

        More of a dummy method for now.
        """
        g.user = None
