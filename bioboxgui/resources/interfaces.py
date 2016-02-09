from flask_restful import marshal, Resource

from bioboxgui import models
from bioboxgui.resources import regular_interface, minimal_biobox


class Interface(Resource):
    def get(self, interface):
        """
        queries the interface with the given name.

        :param interface: the interface's name.
        :return: a json formatted interface.
        """
        result = models.get_bioboxes(interface)
        return {
            'interface': marshal(result[0][1], regular_interface) if result else None,
            'bioboxes': marshal([box for box, interface in result], minimal_biobox) if result else []
        }


class Interfaces(Resource):
    def get(self):
        """
        queries the available interfaces of bioboxes.

        :return: json formatted list of interfaces.
        """
        return {
            'interfaces': marshal(models.Interface.query.all(), regular_interface)
        }
