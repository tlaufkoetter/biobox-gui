import json
import os

import requests
import yaml
from jsonschema import validate


class Biobox():
    """
    represents a generic biobox container description.
    """
    KEY_IMAGE = 'image'
    KEY_ID = 'pmid'
    KEY_HOME_PAGE = 'homepage'
    KEY_MAILING_LIST = 'mailing_list'
    KEY_DESCRIPTION = 'description'
    KEY_TASKS = 'tasks'
    KEY_TITLE = 'title'

    def __init__(self, yaml_dict):
        """
        Forms an object from the given dictionary.

        :param interface: the interface of the biobox.
        :param yaml_dict: a dictionary as it is parsed from yaml code.
        :return:  base
        """
        with open(os.path.join(os.path.dirname(__file__), 'static/image_schema.json'), 'r') as schema_file:

            schema_string = schema_file.read()
            schema = json.loads(schema_string)
            validate(yaml_dict, schema)
        self.image = self.Image(yaml_dict.get(self.KEY_IMAGE))
        self.tasks = [self.Task(task)
                      for task in yaml_dict.get(self.KEY_TASKS)]
        self.pmid = yaml_dict.get(self.KEY_ID)
        self.homepage = yaml_dict.get(self.KEY_HOME_PAGE)
        self.mailing_list = yaml_dict.get(self.KEY_MAILING_LIST)
        self.description = yaml_dict.get(self.KEY_DESCRIPTION)
        self.title = yaml_dict.get(self.KEY_TITLE)

    def get_dict(self):
        dictionary = self.__dict__
        dictionary[self.KEY_IMAGE] = self.image.__dict__
        dictionary[self.KEY_TASKS] = [task.__dict__ for task in self.tasks]
        return dictionary

    class Image():
        """
        is a helper class for :class:`Biobox`.
        """
        KEY_CONTAINER_URI = 'dockerhub'
        KEY_REPO_URL = 'repo'
        KEY_SRC_URL = 'source'

        def __init__(self, yaml_dict):
            """
            Forms an object from the given dictionary.

            :param yaml_dict: a dictionary as it is parsed from yaml code.
            :return:  base
            """
            self.dockerhub = yaml_dict.get(self.KEY_CONTAINER_URI)
            self.repo = yaml_dict.get(self.KEY_REPO_URL)
            self.source = yaml_dict.get(self.KEY_SRC_URL)

    class Task():
        KEY_NAME = 'name'
        KEY_INTERFACE = 'interface'

        def __init__(self, yaml_dict):
            self.name = yaml_dict.get(self.KEY_NAME)
            self.interface = yaml_dict.get(self.KEY_INTERFACE)


def get_current_bioboxes():
    """
    fetches the current image list.
    :return: list of images.
    """
    response = requests.get(
        'https://raw.githubusercontent.com'
        '/pbelmann/data/feature/new-image-list/images.yml'
    )
    return from_list(yaml.load(response.text))


def from_list(yaml_dict):
    """
    creates bioboxes from an interface list.
    :param yaml_dict: the list with bioboxes as it is parsed from a yaml file.
    :return: a list with lists of :class:`Biobox`.
    """
    interfaces = []
    for yaml_box in yaml_dict.get('images'):
        biobox = Biobox(yaml_box)
        interfaces.append(biobox)

    return interfaces
