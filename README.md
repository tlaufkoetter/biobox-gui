# Biobox Gui

A web application for running biobox containers.

## What it does

Shows you the available bioboxes and interfaces at /bioboxgui. Provides a REST API.

## Quickstart

### Docker
```bash
# create data container
> docker run -d \
    -v ~/.biobox/data/input:/opt/application/data/input \
    -v ~/.biobox/data/output:/opt/application/data/output \
    -v ~/.biobox/db:/opt/application/db \
    --name data-biobox \
    busybox echo Data Created!
> docker run -d --volumes-from data-biobox tlaufkoetter/biobox-gui:latest
```
### Standalone
```bash
> git clone https://github.com/tlaufkoetter/biobox-gui
> cd biobox-gui
> python3 -m venv venv     #setting up a virtual environment to avoid possible conflicts.
> source venv/bin/activate #switch to virtual environment
> pip install -r requirements.txt
> mkdir db data
> ./run.py
```
* visit ``http://localhost:5000/bioboxgui`` in your favourite webbrowser.
    * if you're running the app through docker, change localhost to the IP adress of the container.
* or query the REST API with

```
curl -X GET localhost:5000/bioboxgui/api/bioboxes
```
