FROM debian:8

MAINTAINER Tobias Laufkötter <tlaufkoetter@techfak.uni-bielefeld.de>

RUN apt-get -y update && apt-get -y install python3 curl
RUN curl https://bootstrap.pypa.io/get-pip.py | python3

# import the bioboxgui's files into the container.
ENV PROJECT_ROOT /opt/application
RUN mkdir -p $PROJECT_ROOT/bioboxgui
RUN mkdir -p $PROJECT_ROOT/migrations
COPY requirements.txt $PROJECT_ROOT/requirements.txt
COPY run.py $PROJECT_ROOT/run.py
COPY db_handler.py $PROJECT_ROOT/db_handler.py
COPY config.py $PROJECT_ROOT/config.py
COPY bioboxgui $PROJECT_ROOT/bioboxgui
COPY migrations $PROJECT_ROOT/migrations

RUN pip install -r $PROJECT_ROOT/requirements.txt

# setup databse.
RUN cd $PROJECT_ROOT && python3 $PROJECT_ROOT/db_handler.py db upgrade
RUN cd $PROJECT_ROOT && python3 $PROJECT_ROOT/db_handler.py db migrate
RUN cd $PROJECT_ROOT && python3 $PROJECT_ROOT/db_handler.py db upgrade

EXPOSE 5000

ENTRYPOINT python3 $PROJECT_ROOT/run.py
