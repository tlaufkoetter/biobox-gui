# Biobox Gui

| branch        | build status                                                                                                                       |
| ------------- | -------------                                                                                                                      |
| master        | [![Build Status](https://travis-ci.org/tlaufkoetter/biobox-gui.svg?branch=master)](https://travis-ci.org/tlaufkoetter/biobox-gui)  |
| develop       | [![Build Status](https://travis-ci.org/tlaufkoetter/biobox-gui.svg?branch=develop)](https://travis-ci.org/tlaufkoetter/biobox-gui) |


A web application for running biobox containers.

## What it does

Provides a web interface to run and add biobox containers, and track the states of their tasks, and with basic user handling.

## Quickstart

Make sure you have Mesos 0.26.1, Docker, jkrue/jobproxy (commit: dddb503), and Mesos Chronos installed and running.
```bash
# must be on a filesystem shared by the mesos slaves
> export BIOBOX_HOST_BASE=$HOME/.biobox  #maybe add this to your .bashrc, change to your liking
# in case the jobproxy server is NOT on the docker host machine
> export JOBPROXY_URL=<URL jobproxy> # e.g. http://ser.ver:9999/v1/jobproxy
```

### Docker
```bash
> docker run -d \
    -e "DOCKER_JP_URL=$JOBPROXY_URL"
    -e "DOCKER_HOST_BASE=$BIOBOX_HOST_BASE" \
    -v $BIOBOX_HOST_BASE/data:/opt/application/data \
    -v $BIOBOX_HOST_BASE/db:/opt/application/db \
    tlaufkoetter/biobox-gui:develop
```

### Standalone
```bash
> git clone https://github.com/tlaufkoetter/biobox-gui
> cd biobox-gui
> python3 -m venv venv     #setting up a virtual environment to avoid possible conflicts.
> source venv/bin/activate #switch to virtual environment
> pip install -r requirements.txt
> ./run.py
```

* visit ``http://localhost:5000/bioboxgui`` in your favourite webbrowser.
    * if you're running the app through docker, change localhost to the IP address of the container.
* put your *.fq.gz files into $BIOBOX_HOST_BASE/data/input/files
* the output will be found in $BIOBOX_HOST_BASE/data/output/\<date\>\_\<container\>\_\<task\>\_\<user\>\_\<hash\>/
* add a source (e.g. https://raw.githubusercontent.com/pbelmann/data/feature/new-image-list/images.yml)
