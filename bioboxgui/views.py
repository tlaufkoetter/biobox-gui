from flask import render_template, redirect, url_for

from bioboxgui import app


@app.route('/')
def home():
    return redirect(url_for('index'))


@app.route('/bioboxgui')
def index():
    return render_template('index.html')
