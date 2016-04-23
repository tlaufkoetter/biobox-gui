from flask import abort
from flask_restful import Resource, marshal, reqparse, fields
from flask_security import auth_token_required

from bioboxgui import models, db, user_datastore

regular_role = {
    'name': fields.String,
    'description': fields.String
}

regular_user = {
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
    'confirmed_at': fields.DateTime,
    'roles': fields.List(fields.Nested(regular_role))
}


class UserName(Resource):
    # decorators = [auth_token_required]

    def get(self, username):
        user = models.User.query.filter_by(
            username=username
        ).first()
        if not user:
            abort(404)
        return marshal(user, regular_user)

    def delete(self, username):
        user = models.User.query.filter_by(
            username=username
        ).first()
        if not user:
            abort(404)
        db.session.delete(user)
        db.session.commit()
        return None, 204


class UserCreate(Resource):
    # decorators = [
    #     auth_token_required,
    #     roles_accepted('admin')
    # ]

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
        super(UserCreate, self).__init__()

    def get(self):
        users = models.User.query.all()
        return marshal(users, regular_user)

    def post(self):
        user_request = self.reqparse.parse_args()
        username = user_request['username']
        password = user_request['password']
        email = user_request['email']
        try:
            user = user_datastore.create_user(username=username, password=password, email=email)
            db.session.commit()
        except:
            abort(422)

        return marshal(user, regular_user), 201
