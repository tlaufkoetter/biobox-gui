from bioboxgui import app, models
from flask_httpauth import HTTPBasicAuth
from flask_restful import Api

api = Api(app)
auth = HTTPBasicAuth()

from bioboxgui.resources import bioboxes, interfaces, tasks, sources


@auth.verify_password
def verify_password(username, password):
    user = models.User.query.filter_by(
        username=username
    ).first()
    if not user or not user.verify_password(password):
        return False
    return True

api.add_resource(bioboxes.BioboxesAll,
                 '/bioboxgui/api/bioboxes')
api.add_resource(bioboxes.BioboxId,
                 '/bioboxgui/api/bioboxes/<int:biobox_id>')
api.add_resource(bioboxes.BioboxName,
                 '/bioboxgui/api/bioboxes/<string:biobox_name>')
api.add_resource(interfaces.Interfaces,
                 '/bioboxgui/api/interfaces')
api.add_resource(tasks.TasksAll,
                 '/bioboxgui/api/tasks')
api.add_resource(tasks.TaskId,
                 '/bioboxgui/api/tasks/<string:task_id>')
api.add_resource(sources.SourcesAll,
                 '/bioboxgui/api/sources')
# api.add_resource(users.UserName,
#                  '/bioboxgui/api/users/<string:username>')
# api.add_resource(users.UserCreate,
#                  '/bioboxgui/api/users')
