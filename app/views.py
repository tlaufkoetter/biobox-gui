from flask import render_template, redirect, url_for
from flask_nav import Nav
from flask_nav.elements import Navbar, View, Subgroup, Link

from app import app
from app import bioboxes

nav = Nav()
nav.register_element('frontend_top', Navbar(
        View('Home', '.index'),
        View('Bioboxes', '.show_bioboxes'),
        Subgroup(
                'Sources',
                Link('Docker Container',
                     'https://hub.docker.com/r/tlaufkoetter/biobox-gui'),
                Link('Github Source',
                     'https://github.com/tlaufkoetter/biobox-gui-app')
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
    boxes = bioboxes.get_current_bioboxes()
    return render_template('bioboxes.html', boxes=boxes)
