import json
import os.path

import requests
import yaml
from bioboxgui import db
from config import basedir
from flask_security import UserMixin, RoleMixin
from jsonschema import validate

IMAGES_URL = \
    'https://raw.githubusercontent.com' + \
    '/pbelmann/data/feature/new-image-list/images.yml'

# linking bioboxes with tasks since 2016.
association_table = db.Table(
    'association', db.Model.metadata,
    db.Column('biobox_id', db.Integer, db.ForeignKey('biobox.pmid')),
    db.Column('task_id', db.Integer, db.ForeignKey('task.id'))
)

roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'))
)


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship(
        'Role', secondary=roles_users,
        backref=db.backref('users', lazy='dynamic')
    )


class Interface(db.Model):
    """
    represents an interface a biobox or task can implement.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    tasks = db.relationship('Task', backref='interface', lazy='dynamic')


class Biobox(db.Model):
    """
    represents a standard biobox.

    is used for ORM.
    """
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
    source_id = db.Column(db.Integer, db.ForeignKey('source.id'), nullable=False)


class Image(db.Model):
    """
    represents the image part of a biobox.

    existence is based solely on the quest for conformity with the schema.
    """
    KEY_CONTAINER_URI = 'dockerhub'
    KEY_REPO_URL = 'repo'
    KEY_SRC_URL = 'source'

    id = db.Column(db.Integer, primary_key=True)
    dockerhub = db.Column(db.String, unique=True, nullable=False)
    repo = db.Column(db.String, unique=True, nullable=False)
    source = db.Column(db.String)
    biobox_id = db.Column(db.Integer,
                          db.ForeignKey("biobox.pmid"),
                          nullable=False)
    biobox = db.relationship("Biobox", back_populates='image', uselist=False)


class Task(db.Model):
    """
    represents the tasks a biobox can perform.
    """
    KEY_NAME = 'name'
    KEY_INTERFACE = 'interface'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    interface_id = db.Column(db.Integer,
                             db.ForeignKey('interface.id'),
                             nullable=False)


class Source(db.Model):
    """
    represents a source from where bioboxes are loaded.
    """
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, unique=True, nullable=True)
    bioboxes = db.relationship('Biobox', backref='source', lazy='dynamic')


def refresh():
    """
    fetches the currently available bioboxes
    and updates the dataase if necessary.

    :return:  all the bioboxes.
    """
    sources = Source.query.all()
    for source in sources:
        url = source.url
        yaml_dict = fetch_images(url)
        validate_images(yaml_dict)
        for bb_yaml in yaml_dict['images']:
            img_yaml = bb_yaml[Biobox.KEY_IMAGE]
            image = Image.query.filter(
                Image.dockerhub == img_yaml[Image.KEY_CONTAINER_URI]).first()
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
                source=source,
                tasks=[]
            )
            for tsk_yaml in bb_yaml[Biobox.KEY_TASKS]:
                task = Task.query \
                    .join(Task, Interface.tasks) \
                    .filter(Task.name == tsk_yaml[Task.KEY_NAME] and
                            Interface.name == tsk_yaml[Task.KEY_INTERFACE]) \
                    .first()
                interface = Interface.query.filter(
                    Interface.name == tsk_yaml[Task.KEY_INTERFACE]).first()
                interface = interface if interface \
                    else Interface(name=tsk_yaml[Task.KEY_INTERFACE])
                db.session.add(interface)
                task = task if task else Task(
                    name=tsk_yaml[Task.KEY_NAME],
                    interface=interface
                )
                db.session.add(task)
                if task not in biobox.tasks:
                    biobox.tasks.append(task)
            db.session.add(biobox)
    db.session.commit()


def validate_images(yaml_dict):
    """
    validates the given images with the json schema.

    :param yaml_dict: a read yaml file as dictionary.
    :return:  None
    """
    if not isinstance(yaml_dict, dict):
        raise AttributeError("no yaml")
    with open(os.path.join(
            basedir, 'bioboxgui/static/image_schema.json'),
            'r') as schema_file:
        schema_string = schema_file.read()
        schema = json.loads(schema_string)
        for image in yaml_dict['images']:
            validate(image, schema)


def get_bioboxes(interface):
    """
    queries bioboxes that have tasks, that implement a particular interface.

    :param interface: the interface that needs to be implemented.
    :return: a list of bioboxes that meet the aforementioned criteria.
    """
    return db.session.query(Biobox) \
        .join(association_table) \
        .join(Task) \
        .join(Interface) \
        .filter(Interface.name == interface) \
        .order_by(Biobox.title) \
        .all()


def fetch_images(url):
    """
    fetches the images from the given url.

    :param url: the url from where to load the images.
    :return: images as dictionary.
    """
    response = requests.get(url)
    return yaml.load(response.text)
