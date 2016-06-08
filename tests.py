import json
import unittest

import config
import yaml
from flask_testing import TestCase

source_url = 'https://raw.githubusercontent.com/pbelmann/data/feature/new-image-list/images.yml'


class MyTest(TestCase):
    def create_app(self):
        config.SQLALCHEMY_DATABASE_URI = "sqlite://"
        config.TESTING = True
        from bioboxgui import app, db
        self.db = db
        return app

    def setUp(self):
        self.db.create_all()

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
        data = yaml.load(result.data.decode())
        for box in data:
            if box['title'] == 'velvet':
                break
        else:
            print("done goofed")
        assert box['title'] == 'velvet'
        assert box['pmid'] == 18349386
        assert box[
                   'description'] == 'The velvet assembler was one of the first assemblers created for short read sequencing. Velvet was developed at the European Bioinformatics Institute.'
        assert box['homepage'] == 'https://www.ebi.ac.uk/~zerbino/velvet/'
        assert box['mailing_list'] == 'http://listserver.ebi.ac.uk/mailman/listinfo/velvet-users'
        assert box['image']['dockerhub'] == 'bioboxes/velvet'
        assert box['image']['repo'] == 'https://github.com/bioboxes/velvet'
        assert box['image']['source'] == 'https://github.com/dzerbino/velvet'
        assert box['tasks'][0]['name'] == 'default'
        assert box['tasks'][0]['interface']['name'] == 'assembler'
        assert box['tasks'][1]['name'] == 'careful'
        assert box['tasks'][1]['interface']['name'] == 'assembler'
        assert box['source']['url'] == source_url
        assert box['source']['name'] is None
        result = self.client.get('/bioboxgui/api/bioboxes')
        data2 = yaml.load(result.data.decode())
        assert data == data2


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
