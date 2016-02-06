# Biobox Gui

A web application for running biobox containers.

## What it does

Shows your the available bioboxes and interfaces at /bioboxgui. Provides a REST API.

## Quickstart

### Docker
```bash
> docker run -p 5000:5000 tlaufkoetter/biobox-gui:latest
```
### Standalone
```bash
> git clone https://github.com/tlaufkoetter/biobox-gui
> cd biobox-gui
> python3 -m venv venv     #setting up a virtual environment to avoid possible conflicts.
> source venv/bin/activate #switch to virtual environment
> pip install -r requirements.txt
> ./db_handler.py
> ./run.py
```
* visit ``http://localhost:5000/bioboxgui`` in your favourite webbrowser.
* or query the REST API with

```
curl -X GET localhost:5000/bioboxgui/api/bioboxes
```
