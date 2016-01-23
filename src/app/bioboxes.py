import requests
import yaml


class Yaml():
    """
    is the parent of every class that can be generated from yaml files.
    """
    MUST_HAVE = []

    def __init__(self, yaml_dict):
        """
        Forms an object from the given dictionary.

        :param yaml_dict: a dictionary as it is parsed from yaml code.
        :return: Yaml base
        """
        self.validate_yaml(yaml_dict)

    def validate_yaml(self, yaml_dict):
        """
        validates the given dictionary against the MUST_HAVE keys.

        :param yaml_dict: a dictionary as it is parsed from yaml code.
        :return: None
        :raises: LookupError when key requirements aren't fulfilled.
        """
        for key in self.MUST_HAVE:
            if yaml_dict.has_key(key) and yaml_dict.get(key):
                pass
            else:
                raise LookupError, 'error with the "%s" key' % key


class Biobox(Yaml):
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

    MUST_HAVE = [
        KEY_IMAGE,
        KEY_ID,
        KEY_DESCRIPTION,
        KEY_TASKS,
        KEY_TITLE
    ]

    def __init__(self, yaml_dict):
        """
        Forms an object from the given dictionary.

        :param interface: the interface of the biobox.
        :param yaml_dict: a dictionary as it is parsed from yaml code.
        :return: Yaml base
        """
        Yaml.__init__(self, yaml_dict)
        self.image = self.Image(yaml_dict.get(self.KEY_IMAGE))
        self.tasks = [self.Task(task) for task in yaml_dict.get(self.KEY_TASKS)]
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

    class Image(Yaml):
        """
        is a helper class for :class:`Biobox`.
        """
        KEY_CONTAINER_URI = 'dockerhub'
        KEY_REPO_URL = 'repo'
        KEY_SRC_URL = 'source'

        MUST_HAVE = [
            KEY_CONTAINER_URI,
            KEY_REPO_URL
        ]

        def __init__(self, yaml_dict):
            """
            Forms an object from the given dictionary.

            :param yaml_dict: a dictionary as it is parsed from yaml code.
            :return: Yaml base
            """
            Yaml.__init__(self, yaml_dict)
            self.dockerhub = yaml_dict.get(self.KEY_CONTAINER_URI)
            self.repo = yaml_dict.get(self.KEY_REPO_URL)
            self.source = yaml_dict.get(self.KEY_SRC_URL)

    class Task(Yaml):
        KEY_NAME = 'name'
        KEY_INTERFACE = 'interface'

        MUST_HAVE = [
            KEY_NAME,
            KEY_INTERFACE
        ]

        def __init__(self, yaml_dict):
            Yaml.__init__(self, yaml_dict)
            self.name = yaml_dict.get(self.KEY_NAME)
            self.interface = yaml_dict.get(self.KEY_INTERFACE)


def get_current_bioboxes():
    response = requests.get('https://raw.githubusercontent.com/pbelmann/data/feature/new-image-list/images.yml')
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
