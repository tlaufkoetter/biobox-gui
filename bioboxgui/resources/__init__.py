from flask_restful import fields

regular_interface = {
    'name': fields.String
}

regular_image = {
    'dockerhub': fields.String,
    'repo': fields.String,
    'source': fields.String
}

regular_task = {
    'name': fields.String,
    'interface': fields.Nested(regular_interface)
}

minimal_biobox = {
    'title': fields.String,
    'pmid': fields.Integer
}

regular_biobox = minimal_biobox.copy()
regular_biobox['description'] = fields.String
regular_biobox['image'] = fields.Nested(regular_image)
regular_biobox['homepage'] = fields.String
regular_biobox['mailing_list'] = fields.String
regular_biobox['tasks'] = fields.List(fields.Nested(regular_task))
