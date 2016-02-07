from flask import jsonify, make_response

from bioboxgui import app, models, db

BAD_REQUEST = 400
NOT_IMPLEMENTED = 405

POST_METHOD = 'POST'
GET_METHOD = 'GET'
DELETE_METHOD = 'DELETE'
PUT_METHOD = 'PUT'


@app.errorhandler(NOT_IMPLEMENTED)
def not_implemented(error):
    return make_response(jsonify({'error': 'not yet implemented'}), NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/bioboxes', methods=[GET_METHOD])
def get_bioboxes():
    """
    queries a list of available bioboxes.

    will be empty when no bioboxes are stored.
    :return: json formatted bioboxes.
    """
    bioboxes = models.Biobox.query.order_by(models.Biobox.title).all()
    return jsonify({'images': [biobox.json for biobox in bioboxes]})


@app.route('/bioboxgui/api/bioboxes/update', methods=[GET_METHOD])
def update_bioboxes():
    """
    updates the stored bioboxes.

    :return: json formatted bioboxes.
    """
    models.refresh()
    return get_bioboxes()


@app.route('/bioboxgui/api/bioboxes/interfaces', methods=[GET_METHOD])
def get_biobox_types():
    """
    queries the available interfaces of bioboxes.

    :return: json formatted list of interfaces.
    """
    tasks = models.Task.query.order_by(models.Task.interface).all()
    interfaces = set([task.interface for task in tasks])
    return jsonify({'interfaces': [{'name': interface} for interface in interfaces]})


@app.route('/bioboxgui/api/bioboxes/interfaces/<string:interface>', methods=[GET_METHOD])
def get_interface(interface):
    """
    fetches all the bioboxes that implemnt the given interface.

    :param interface: the interface to query.
    :return: json formatted bioboxes.
    """
    bioboxes = db.session \
        .query(models.Biobox) \
        .join((models.Task, models.Biobox.tasks)) \
        .filter(models.Task.interface == interface) \
        .order_by(models.Biobox.title)
    return jsonify({'images': [biobox.json for biobox in bioboxes]})


@app.route('/bioboxgui/api/bioboxes/<int:biobox_id>', methods=[GET_METHOD])
def get_biobox(biobox_id):
    """
    fetches a single biobox with the given id.

    :param biobox_id: the pmid of the biobox.
    :return: a json formatted biobox.
    """
    return jsonify(models.Biobox.query.get(biobox_id).json)
