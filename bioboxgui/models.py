import json
import os.path

import requests
import yaml
from jsonschema import validate

from bioboxgui import db
from config import basedir

IMAGES_URL = 'https://raw.githubusercontent.com/pbelmann/data/feature/new-image-list/images.yml'

association_table = db.Table('association', db.Model.metadata,
                             db.Column('biobox_id', db.Integer, db.ForeignKey('biobox.pmid')),
                             db.Column('task_id', db.Integer, db.ForeignKey('task.id'))
                             )


class Biobox(db.Model):
    KEY_IMAGE = 'image'
    KEY_ID = 'pmid'
    KEY_HOME_PAGE = 'homepage'
    KEY_MAILING_LIST = 'mailing_list'
    KEY_DESCRIPTION = 'description'
    KEY_TASKS = 'tasks'
    KEY_TITLE = 'title'

    pmid = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=True, nullable=False)
    homepage = db.Column(db.String)
    mailing_list = db.Column(db.String)
    description = db.Column(db.String, nullable=False)
    tasks = db.relationship('Task', secondary=association_table)
    image = db.relationship('Image', uselist=False, back_populates='biobox')

    @property
    def json(self):
        return {
            self.KEY_ID: self.pmid,
            self.KEY_TITLE: self.title,
            self.KEY_HOME_PAGE: self.homepage,
            self.KEY_MAILING_LIST: self.mailing_list,
            self.KEY_DESCRIPTION: self.description,
            self.KEY_IMAGE: self.image.json,
            self.KEY_TASKS: [task.json for task in self.tasks]
        }


class Image(db.Model):
    KEY_CONTAINER_URI = 'dockerhub'
    KEY_REPO_URL = 'repo'
    KEY_SRC_URL = 'source'

    id = db.Column(db.Integer, primary_key=True)
    dockerhub = db.Column(db.String, unique=True, nullable=False)
    repo = db.Column(db.String, unique=True, nullable=False)
    source = db.Column(db.String)
    biobox_id = db.Column(db.Integer, db.ForeignKey("biobox.pmid"), nullable=False)
    biobox = db.relationship("Biobox", back_populates='image', uselist=False)

    @property
    def json(self):
        return {
            self.KEY_CONTAINER_URI: self.dockerhub,
            self.KEY_REPO_URL: self.repo,
            self.KEY_SRC_URL: self.source
        }


class Task(db.Model):
    KEY_NAME = 'name'
    KEY_INTERFACE = 'interface'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    interface = db.Column(db.String, nullable=False)

    @property
    def json(self):
        return {
            self.KEY_NAME: self.name,
            self.KEY_INTERFACE: self.interface
        }


def refresh():
    yaml_dict = fetch_images(IMAGES_URL)
    validate_images(yaml_dict)
    for bb_yaml in yaml_dict['images']:
        img_yaml = bb_yaml[Biobox.KEY_IMAGE]
        image = Image.query.filter(Image.dockerhub == img_yaml[Image.KEY_CONTAINER_URI]).first()
        image = image if image else Image(
                dockerhub=img_yaml[Image.KEY_CONTAINER_URI],
                repo=img_yaml.get(Image.KEY_REPO_URL),
                source=img_yaml.get(Image.KEY_SRC_URL)
        )
        biobox = Biobox.query.get(bb_yaml[Biobox.KEY_ID])
        biobox = biobox if biobox else Biobox(
                title=bb_yaml.get(Biobox.KEY_TITLE),
                pmid=bb_yaml.get(Biobox.KEY_ID),
                homepage=bb_yaml.get(Biobox.KEY_HOME_PAGE),
                mailing_list=bb_yaml.get(Biobox.KEY_MAILING_LIST),
                description=bb_yaml.get(Biobox.KEY_DESCRIPTION),
                image=image,
                tasks=[]
        )
        for tsk_yaml in bb_yaml[Biobox.KEY_TASKS]:
            task = Task.query.filter(Task.name == tsk_yaml[Task.KEY_NAME]
                                     and Task.interface == tsk_yaml[Task.KEY_INTERFACE]).first()
            task = task if task else Task(
                    name=tsk_yaml[Task.KEY_NAME],
                    interface=tsk_yaml[Task.KEY_INTERFACE]
            )
            if not task in biobox.tasks:
                biobox.tasks.append(task)
        db.session.add(biobox)
        db.session.commit()


def validate_images(yaml_dict):
    with open(os.path.join(basedir, 'bioboxgui/static/image_schema.json'), 'r') as schema_file:
        schema_string = schema_file.read()
        schema = json.loads(schema_string)
        for image in yaml_dict['images']:
            validate(image, schema)


def fetch_images(url):
    response = requests.get(url)
    return yaml.load(response.text)
