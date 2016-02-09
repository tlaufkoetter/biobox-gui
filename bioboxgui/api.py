from flask_restful import Api

from bioboxgui import app
from bioboxgui.resources import bioboxes, interfaces

api = Api(app)

api.add_resource(bioboxes.BioboxesAll, '/bioboxgui/api/bioboxes')
api.add_resource(bioboxes.BioboxId, '/bioboxgui/api/bioboxes/<int:biobox_id>')
api.add_resource(bioboxes.BioboxName, '/bioboxgui/api/bioboxes/<string:biobox_name>')
api.add_resource(bioboxes.BioboxesUpdate, '/bioboxgui/api/bioboxes/update')
api.add_resource(interfaces.Interfaces, '/bioboxgui/api/interfaces')
api.add_resource(interfaces.Interface, '/bioboxgui/api/interfaces/<string:interface>')
