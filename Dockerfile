FROM python:2.7

MAINTAINER Tobias Laufkötter <tlaufkoetter@techfak.uni-bielefeld.de>

# manually install mesos lib, because no pypi.
RUN wget http://downloads.mesosphere.io/master/debian/8/mesos-0.26.0-py2.7-linux-x86_64.egg && easy_install mesos-0.26.0-py2.7-linux-x86_64.egg
RUN rm mesos-0.26.0-py2.7-linux-x86_64.egg

# import the bioboxgui's files into the container.
ENV PROJECT_ROOT /opt/application
RUN mkdir -p $PROJECT_ROOT/bioboxgui
COPY requirements.txt $PROJECT_ROOT/requirements.txt
COPY run.py $PROJECT_ROOT/run.py
COPY bioboxgui $PROJECT_ROOT/bioboxgui

RUN pip install -r $PROJECT_ROOT/requirements.txt

EXPOSE 5000

ENTRYPOINT python $PROJECT_ROOT/run.py
