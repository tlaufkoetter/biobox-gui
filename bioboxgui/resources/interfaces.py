from flask_restful import marshal, Resource, fields
from flask import abort
from bioboxgui import models

regular_interface = {
    'name': fields.String
}


class Interface(Resource):
    def get(self, interface):
        """
        queries the interface with the given name.

        :param interface: the interface's name.
        :return: a json formatted interface.
        """
        result = models.get_bioboxes(interface)
        if not result:
            abort(404)
        return marshal(result, regular_interface)


class Interfaces(Resource):
    def get(self):
        """
        queries the available interfaces of bioboxes.

        :return: json formatted list of interfaces.
        """
        result = models.Interface.query.all()
        if not result:
            abort(404)
        return marshal(result, regular_interface)
