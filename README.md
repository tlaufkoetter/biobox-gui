# Biobox Gui

A web application for running biobox containers.

## What it does

For now you can view a list of bioboxes on /bioboxgui/bioboxes or query JSON formatted biobox data via a GET request to /bioboxgui/api/bioboxes.

## Quickstart

### Docker

``> docker run -p 5000:5000 tlaufkoetter/biobox-gui:latest``

### Standalone

``> git clone https://github.com/tlaufkoetter/biobox-gui``
``> cd biobox-gui``
``> python3 -m venv venv`` setting up a virtual environment to avoid possible conflicts.
``> source venv/bin/activate`` switch to virtual environment, use ``> deactivate`` when done
``> pip install -r requirements.txt``
``> ./run.py``

* visit ``http://localhost:5000/bioboxgui`` in your favourite webbrowser.
* or query the REST API with

``curl -X GET localhost:5000/bioboxgui/api/bioboxes``
