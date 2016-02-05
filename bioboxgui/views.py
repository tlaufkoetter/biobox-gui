from flask import render_template, redirect, url_for
from flask_nav import Nav
from flask_nav.elements import Navbar, View, Subgroup, Link

from bioboxgui import app
from bioboxgui import models

nav = Nav()
nav.register_element('frontend_top', Navbar(
        View('Home', '.index'),
        View('Bioboxes', '.show_bioboxes'),
        Subgroup(
                'Sources',
                Link('Docker Container',
                     'https://hub.docker.com/r/tlaufkoetter/bioboxgui'),
                Link('Github Source',
                     'https://github.com/tlaufkoetter/bioboxgui-bioboxgui')
        )
))
nav.init_app(app)


@app.route('/')
def home():
    return redirect(url_for('index'))


@app.route('/bioboxgui')
def index():
    return render_template('index.html', title="Biobox GUI")


@app.route('/bioboxgui/bioboxes')
def show_bioboxes():
    boxes = models.Biobox.query.all()
    return render_template('bioboxes.html', boxes=boxes)
