# Biobox Gui

A web application for running biobox containers.

## What it does

For now you can view a list of bioboxes on /bioboxgui/bioboxes or query JSON formatted biobox data via a GET request to /bioboxgui/api/bioboxes.

## Quickstart

* install the requirements

``pip install -r requirements.txt``

* launch the application

``./run.py``

* visit ``http://localhost:5000/bioboxgui`` in your favourite webbrowser.
* or query the REST API with

``curl -X GET localhost:5000/bioboxgui/api/bioboxes``
