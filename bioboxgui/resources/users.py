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
    @auth.login_required
    def get(self, username):
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
    def delete(self, username):
        user = models.User.query.filter_by(
            username=username
        ).first()
        if not user:
            abort(404)
        db.session.delete(user)
        db.session.commit()
        return None, 204


class UserAll(Resource):
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
        users = models.User.query.all()
        return marshal(users, regular_user)

    @auth.login_required
    @roles_accepted('admin')
    def post(self):
        user_request = self.reqparse.parse_args()
        username = user_request['username']
        password = user_request['password']
        email = user_request['email']
        if username is None or password is None:
            abort(400)  # missing arguments
        if models.User.query.filter_by(username=username).first() is not None:
            abort(400)  # existing user
        user = models.User(username=username, email=email)
        user.hash_password(password)
        db.session.add(user)
        db.session.commit()

        return marshal(user, regular_user), 201


class UserLogin(Resource):
    @basic_auth.login_required
    def post(self):
        try:
            token = g.user.generate_auth_token()
        except SignatureExpired:
            abort(400)  # valid token, but expired
        except BadSignature:
            abort(401)  # invalid token
        return marshal({
            'token': token.decode('ascii'),
            'roles': [role.name for role in g.user.roles]
            }, regular_token), 200
