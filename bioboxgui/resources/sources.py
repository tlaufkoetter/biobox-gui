from flask import abort
from flask_restful import marshal, Resource, fields, reqparse
from jsonschema import ValidationError

from bioboxgui import models, db
from bioboxgui.api import auth, roles_accepted

# standard format for source of bioboxes.
regular_source = {
    'url': fields.String,
    'name': fields.String,
}


class SourcesAll(Resource):
    """
    Accessing all the sources.
    """

    def __init__(self):
        """
        parsing the request for parameters.

        url and name
        """
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
        if not result:
            result = []
        return marshal(result, regular_source, envelope="sources")

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
        if url == "" or name == "" or not url or not name:
            abort(400, "params empty with url")
        if not source:
            source = models.Source.query.filter_by(name=name).first()
            if not source:
                source = models.Source(url=url, name=name)
            else:
                abort(400, "source exists with name")
        else:
            abort(400, "source exists")

        try:
            yaml_dict = models.fetch_images(url)
        except:
            abort(400, "yaml invalid")
        try:
            models.validate_images(yaml_dict)
        except ValidationError as e:
            abort(400, e.message)
        except AttributeError as e:
            abort(400)

        db.session.add(source)
        db.session.commit()

        return marshal(source, regular_source), 201


class SourceName(Resource):
    """
    Accessing a single resource by name.
    """

    @auth.login_required
    @roles_accepted('admin', 'trusted')
    def get(self, name):
        """
        get a source by it's name.

        :param name: the source's name
        :return: json formatted source
        """
        source = models.Source.query.filter_by(name=name).first()
        if not source:
            abort(404)
        return marshal(source, regular_source, envelope="source")

    @auth.login_required
    @roles_accepted('admin', 'trusted')
    def delete(self, name):
        """
        deletes the resource with the given name

        :param name: the name of the source to delete
        :return: None
        """
        source = models.Source.query.filter_by(name=name).first()
        if not source:
            abort(404)
        for box in source.bioboxes:
            db.session.delete(box)
        db.session.delete(source)
        db.session.commit()

        return None, 204
