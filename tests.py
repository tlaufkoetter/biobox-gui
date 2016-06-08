import json
import unittest

import config
import yaml
from flask_testing import TestCase
from mock import patch

source_url = 'https://raw.githubusercontent.com/pbelmann/data/feature/new-image-list/images.yml'

def fetch_images(url):
    content = """
---
version: 0.1.0
images:
  -
    title: velvet
    image:
      dockerhub: bioboxes/velvet
      repo: https://github.com/bioboxes/velvet
      source: https://github.com/dzerbino/velvet
    pmid: 18349386
    homepage: https://www.ebi.ac.uk/~zerbino/velvet/
    mailing_list: http://listserver.ebi.ac.uk/mailman/listinfo/velvet-users
    description:
      The velvet assembler was one of the first assemblers created for short read sequencing. Velvet was developed at the European Bioinformatics Institute.
    tasks:
      - name: default
        interface: assembler
      - name: careful
        interface: assembler"""
    return yaml.load(content)


class MyTest(TestCase):
    def create_app(self):
        config.SQLALCHEMY_DATABASE_URI = "sqlite://"
        config.TESTING = True
        from bioboxgui import app, db
        self.db = db
        return app

    def setUp(self):
        self.db.create_all()
        self.patcher = patch('bioboxgui.models.fetch_images', fetch_images)
        self.patcher.start()

    def tearDown(self):
        self.db.session.remove()
        self.db.drop_all()


class BioboxesTest(MyTest):

    def test_update_get_bioboxes(self):
        result = self.client.get('/bioboxgui/api/bioboxes')
        assert result is not None
        assert result.status_code == 404
        self.client.post('/bioboxgui/api/sources', data=json.dumps({'url': source_url}),
                         headers={"Content-type": 'application/json'})
        result = self.client.put('/bioboxgui/api/bioboxes')
        assert result is not None
        assert result.status_code == 200
        data = yaml.load(result.data.decode())[0]
        assert data['title'] == 'velvet'
        assert data['pmid'] == 18349386
        assert data[
                   'description'] == 'The velvet assembler was one of the first assemblers created for short read sequencing. Velvet was developed at the European Bioinformatics Institute.'
        assert data['homepage'] == 'https://www.ebi.ac.uk/~zerbino/velvet/'
        assert data['mailing_list'] == 'http://listserver.ebi.ac.uk/mailman/listinfo/velvet-users'
        assert data['image']['dockerhub'] == 'bioboxes/velvet'
        assert data['image']['repo'] == 'https://github.com/bioboxes/velvet'
        assert data['image']['source'] == 'https://github.com/dzerbino/velvet'
        assert data['tasks'][0]['name'] == 'default'
        assert data['tasks'][0]['interface']['name'] == 'assembler'
        assert data['tasks'][1]['name'] == 'careful'
        assert data['tasks'][1]['interface']['name'] == 'assembler'
        result = self.client.get('/bioboxgui/api/bioboxes')
        assert data == yaml.load(result.data.decode())[0]


class SourcesTest(MyTest):
    def test_post_get(self):
        result = self.client.get('/bioboxgui/api/sources')
        assert result.status_code == 404
        source = {
            'url': source_url,
            'name': 'peter'
        }
        result = self.client.post('/bioboxgui/api/sources', data=json.dumps(source),
                                  headers={'Content-type': 'application/json'})
        assert result.status_code == 201
        data = yaml.load(result.data.decode())
        assert data['url'] == source['url']
        assert data['name'] == source['name']

if __name__ == '__main__':
    unittest.main()
