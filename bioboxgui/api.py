from flask_restful import Resource, fields, marshal_with, Api

from bioboxgui import app, models

api = Api(app)

minimal_biobox = {
    'title': fields.String,
    'pmid': fields.Integer
}

regular_image = {
    'dockerhub': fields.String,
    'repo': fields.String,
    'source': fields.String
}

regular_interface = {
    'name': fields.String
}

regular_task = {
    'name': fields.String,
    'interface': fields.Nested(regular_interface)
}

regular_biobox = minimal_biobox.copy()
regular_biobox['description'] = fields.String
regular_biobox['image'] = fields.Nested(regular_image)
regular_biobox['homepage'] = fields.String
regular_biobox['mailing_list'] = fields.String
regular_biobox['tasks'] = fields.List(fields.Nested(regular_task))


class Bioboxes(Resource):
    @marshal_with(minimal_biobox)
    def get(self):
        """
        queries a list of available bioboxes.

        will be empty when no bioboxes are stored.
        :return: json formatted bioboxes.
        """
        bioboxes = models.Biobox.query.order_by(models.Biobox.title).all()
        return bioboxes


class BioboxesUpdate(Resource):
    @marshal_with(minimal_biobox)
    def get(self):
        """
        updates the stored bioboxes.

        :return: json formatted bioboxes.
        """
        models.refresh()
        return models.Biobox.query.order_by(models.Biobox.title).all()


class Biobox(Resource):
    @marshal_with(regular_biobox)
    def get(self, biobox_id):
        """
        fetches a single biobox with the given id.

        :param biobox_id: the pmid of the biobox.
        :return: a json formatted biobox.
        """
        return models.Biobox.query.get(biobox_id)


class Interface(Resource):
    @marshal_with(minimal_biobox)
    def get(self, interface):
        """
        queries the interface with the given name.

        :param interface: the interface's name.
        :return: a json formatted interface.
        """
        return models.get_bioboxes(interface)


class Interfaces(Resource):
    @marshal_with(regular_interface)
    def get(self):
        """
        queries the available interfaces of bioboxes.

        :return: json formatted list of interfaces.
        """
        return models.Interface.query.all()


api.add_resource(Bioboxes, '/bioboxgui/api/bioboxes')
api.add_resource(Biobox, '/bioboxgui/api/bioboxes/<int:biobox_id>')
api.add_resource(BioboxesUpdate, '/bioboxgui/api/bioboxes/update')
api.add_resource(Interfaces, '/bioboxgui/api/bioboxes/interfaces')
api.add_resource(Interface, '/bioboxgui/api/bioboxes/interfaces/<string:interface>')
