from flask_restful import Resource, marshal, reqparse
from bioboxgui import models, db
from flask import abort
from flask_restful import fields

regular_user = {
    'username': fields.String,
    'email': fields.String,
}


class UserName(Resource):
    def get(username):
        user = models.User.filter_by(models.User.username == username).first()
        if not user:
            abort(404)
        return marshal(user, regular_user)


class UserCreate(Resource):
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

    def post(self):
        user_request = self.reqparse.parse_args()
        username = user_request['username']
        password = user_request['password']
        email = user_request['email']

        user = models.User.filter_by(
            models.User.username == username or models.User.email == email
        ).first()
        if user:
            abort(404)
        user = models.User(
            username=username,
            email=email,
            password_hash=models.User.hash_password(password)
        )

        db.session.add(user)
        db.session.commit()

        return marshal(user, regular_user)
