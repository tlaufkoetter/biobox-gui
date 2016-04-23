from flask import abort
from flask_restful import marshal, Resource, fields
# from flask_security import auth_token_required

from bioboxgui import models

regular_interface = {
    'name': fields.String
}


class Interfaces(Resource):
    # decorators = [auth_token_required]

    def get(self):
        """
        queries the available interfaces of bioboxes.

        :return: json formatted list of interfaces.
        """
        result = models.Interface.query.all()
        if not result:
            abort(404)
        return marshal(result, regular_interface)
