from flask import render_template, redirect, url_for

from bioboxgui import app


@app.route('/')
def home():
    """
    catching the lost souls at '/' and redirect them to '/bioboxgui'.

    could need deactivation when another server is listening on '/'.

    :return: redirection to '/bioboxgui'.
    """
    return redirect(url_for('index'))


@app.route('/bioboxgui')
def index():
    """
    main page of the application.

    thanks to angular.js there is nothing left to reoute.

    :return: the template for the main page.
    """
    return render_template('index.html')
