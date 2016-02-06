from flask import jsonify, abort, request, make_response

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
    return jsonify({'images': [biobox.json for biobox in models.Biobox.query.all()]})


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
    interfaces = set([task.interface for task in models.Task.query.all()])
    return jsonify({'interfaces': [{'name': interface} for interface in interfaces]})


@app.route('/bioboxgui/api/bioboxes/interfaces/<string:interface>', methods=[GET_METHOD])
def get_interface(interface):
    """
    fetches all the bioboxes that implemnt the given interface.

    :param interface: the interface to query.
    :return: json formatted bioboxes.
    """
    return jsonify({
        'images': [
            biobox.json
            for biobox in db.session \
                .query(models.Biobox) \
                .join((models.Task, models.Biobox.tasks)) \
                .filter(models.Task.interface == interface)
            ]
    })


@app.route('/bioboxgui/api/bioboxes', methods=[POST_METHOD])
def create_biobox():
    if request.json:
        abort(NOT_IMPLEMENTED)
    else:
        abort(BAD_REQUEST)


@app.route('/bioboxgui/api/bioboxes/<int:biobox_id>', methods=[GET_METHOD])
def get_biobox(biobox_id):
    abort(NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/bioboxes/<int:biobox_id>', methods=[PUT_METHOD])
def update_biobox(biobox_id):
    if request.json:
        abort(NOT_IMPLEMENTED)
    else:
        abort(BAD_REQUEST)


@app.route('/bioboxgui/api/bioboxes/<int:biobox_id>', methods=[DELETE_METHOD])
def delete_biobox(biobox_id):
    abort(NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/tasks', methods=[GET_METHOD])
def get_tasks():
    abort(NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/tasks', methods=[POST_METHOD])
def create_task():
    if request.json:
        abort(NOT_IMPLEMENTED)
    else:
        abort(BAD_REQUEST)


@app.route('/bioboxgui/api/tasks/<int:task_id>', methods=[GET_METHOD])
def get_task(task_id):
    abort(NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/tasks/<int:task_id>', methods=[PUT_METHOD])
def update_task(task_id):
    if request.json:
        abort(NOT_IMPLEMENTED)
    else:
        abort(BAD_REQUEST)


@app.route('/bioboxgui/api/tasks/<int:task_id>', methods=[DELETE_METHOD])
def delete_task(task_id):
    abort(NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/users', methods=[GET_METHOD])
def get_users():
    abort(NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/users', methods=[POST_METHOD])
def create_user():
    if request.json:
        abort(NOT_IMPLEMENTED)
    else:
        abort(BAD_REQUEST)


@app.route('/bioboxgui/api/users/<int:user_id>', methods=[GET_METHOD])
def get_user(user_id):
    abort(NOT_IMPLEMENTED)


@app.route('/bioboxgui/api/users/<int:user_id>', methods=[PUT_METHOD])
def update_user(user_id):
    if request.json:
        abort(NOT_IMPLEMENTED)
    else:
        abort(BAD_REQUEST)


@app.route('/bioboxgui/api/users/<int:user_id>', methods=[DELETE_METHOD])
def delete_user(user_id):
    abort(NOT_IMPLEMENTED)
