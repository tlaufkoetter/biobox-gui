FROM python:2.7

MAINTAINER Tobias Laufkötter <tlaufkoetter@techfak.uni-bielefeld.de>

RUN wget http://downloads.mesosphere.io/master/debian/8/mesos-0.26.0-py2.7-linux-x86_64.egg && easy_install mesos-0.26.0-py2.7-linux-x86_64.egg
RUN rm mesos-0.26.0-py2.7-linux-x86_64.egg

RUN mkdir /opt/app
RUN git clone https://github.com/tlaufkoetter/biobox-gui-app /opt/app --branch=develop
RUN pip install -r /opt/app/requirements.txt
RUN echo "cd /opt/app; git pull; pip install -r /opt/app/requirements.txt; python /opt/app/run.py" > /opt/run.sh

EXPOSE 5000

ENTRYPOINT ["/bin/bash", "/opt/run.sh"]
