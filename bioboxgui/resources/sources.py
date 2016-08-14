from flask import abort
from flask_restful import marshal, Resource, fields, reqparse
from jsonschema import ValidationError

from bioboxgui import models, db
from bioboxgui.api import auth, roles_accepted

regular_source = {
    'url': fields.String,
    'name': fields.String,
}


class SourcesAll(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'url',
            type=str,
            required=True,
            help='No URL provided',
            location='json'
        )
        self.reqparse.add_argument(
            'name',
            type=str,
            required=False,
            help='No name provided',
            location='json'
        )
        super(SourcesAll, self).__init__()

    @auth.login_required
    @roles_accepted('admin', 'trusted')
    def get(self):
        """
        queries a list of manages sources for bioboxes.

        :return: json sources.
        """
        result = models.Source.query.all()
        if result:
            return marshal(result, regular_source)
        else:
            abort(404)

    @auth.login_required
    @roles_accepted('admin', 'trusted')
    def post(self):
        """
        puts a new source into the database.

        :return: the newly created source
        """
        source_request = self.reqparse.parse_args()
        url = source_request['url']
        name = source_request.get('name')
        source = models.Source.query.filter_by(url=url).first()
        if not source:
            source = models.Source(url=url, name=name)
        else:
            abort(400, "source exists")

        try:
            yaml_dict = models.fetch_images(url)
        except:
            abort(400)
        try:
            models.validate_images(yaml_dict)
        except ValidationError as e:
            abort(400, e.message)
        except AttributeError as e:
            abort(400)

        db.session.add(source)
        db.session.commit()

        return marshal(source, regular_source), 201
