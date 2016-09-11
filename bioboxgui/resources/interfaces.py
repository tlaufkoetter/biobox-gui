"""
resource for the interfaces a task of a biobox can implement.
"""
from flask_restful import marshal, Resource, fields

from bioboxgui import models

# standard form of an interface.
regular_interface = {
    'name': fields.String
}


class Interfaces(Resource):
    """
    Accessing all the interfaces.
    """

    def get(self):
        """
        queries the available interfaces of bioboxes.

        :return: json formatted list of interfaces.
        """
        result = models.Interface.query.all()
        if not result:
            return {'interfaces': []}
        return marshal(result, regular_interface, envelope='interfaces')
