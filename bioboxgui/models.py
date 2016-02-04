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
    pmid = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=True, nullable=False)
    homepage = db.Column(db.String)
    mailing_list = db.Column(db.String)
    description = db.Column(db.String, nullable=False)
    tasks = db.relationship('Task', secondary=association_table)
    image = db.relationship('Image', uselist=False, back_populates='image')


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dockerhub = db.Column(db.String, unique=True, nullable=False)
    repo = db.Column(db.String, unique=True, nullable=False)
    source = db.Column(db.String)
    biobox_id = db.Column(db.Integer, db.ForeignKey("biobox.pmid"), nullable=False)
    biobox = db.relationship("Biobox", back_populates='biobox', uselist=False)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    interface = db.Column(db.String, nullable=False)


def refresh():
    yaml_dict = fetch_images(IMAGES_URL)
    validate_images(yaml_dict)
    for bb_yaml in yaml_dict['images']:
        img_yaml = bb_yaml['image']
        image = Image.query.filter(Image.dockerhub == img_yaml['dockerhub']).first()
        image = image if image else Image(
                dockerhub=img_yaml['dockerhub'],
                repo=img_yaml.get('repo'),
                source=img_yaml.get('source')
        )
        biobox = Biobox.query.get(bb_yaml['pmid'])
        biobox = biobox if biobox else Biobox(
                pmid=bb_yaml.get('pmid'),
                homepage=bb_yaml.get('homepage'),
                mailing_list=bb_yaml.get('mailing_list'),
                description=bb_yaml.get('description'),
                image=image,
                tasks=[]
        )
        for tsk_yaml in bb_yaml['tasks']:
            task = Task.query.filter(Task.name == tsk_yaml['name']
                                     and Task.interface == tsk_yaml['interface']).first()
            task = task if task else Task(
                    name=tsk_yaml['name'],
                    interface=tsk_yaml['interface']
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
