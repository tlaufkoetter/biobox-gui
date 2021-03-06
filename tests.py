import json
import unittest

import yaml
from flask_testing import TestCase
from config import API_VERSION as version

source_url = 'https://raw.githubusercontent.com' + \
    '/pbelmann/data/feature/new-image-list/images.yml'


class MyTest(TestCase):
    def create_app(self):
        import config
        config.SQLALCHEMY_DATABASE_URI = 'sqlite://'
        config.TESTING = True
        from bioboxgui import app, db
        self.db = db
        return app

    def setUp(self):
        assert True is not False
        assert 2 > 1
        self.db.drop_all()
        self._create_user()

        token_response = self.client\
            .post('/bioboxgui/api/' + version + '/token',
                  data=json.dumps({
                      'email': 'admin@admin.com',
                      'password': 'password'
                  }),
                  headers={
                      'Content-type': 'application/json'
                  })
        json_response = json.loads(bytes.decode(token_response.data))
        self.token = json_response['token']

    def _create_user(self):
        from bioboxgui import models
        self.db.create_all()
        role_names = ['admin', 'trusted', 'common']
        roles = []
        for role_name in role_names:
            role = models.Role.query.filter_by(name=role_name).first()
            if not role:
                role = models.Role(name=role_name)
            roles.append(role)

        if not models.User.query.filter_by(username='admin').first():
            user = models.User(
                username='admin', email='admin@admin.com', roles=roles
            )
            user.hash_password('password')
            self.db.session.add(user)
        self.db.session.commit()

    def tearDown(self):
        self.db.session.remove()
        self.db.drop_all()


class BioboxesTest(MyTest):
    def test_update_get_bioboxes(self):
        result = self.client.get(
            '/bioboxgui/api/' + version + '/bioboxes',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        assert result is not None
        assert result.status_code == 200
        self.client.post(
            '/bioboxgui/api/' + version + '/sources',
            data=json.dumps({
                'url': source_url,
                'name': 'testname'
            }),
            headers={
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + self.token
            })
        result = self.client.put(
            '/bioboxgui/api/' + version + '/bioboxes',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        assert result is not None
        assert result.status_code == 200
        data = yaml.load(result.data.decode())
        for box in data['bioboxes']:
            if box['title'] == 'velvet':
                break
        else:
            print('done goofed')
        assert box['title'] == 'velvet'
        assert box['pmid'] == 18349386
        assert box['description'] ==\
            'The velvet assembler was one of the first ' + \
            'assemblers created for short read sequencing. ' + \
            'Velvet was developed at the European Bioinformatics Institute.'
        assert box['homepage'] == 'https://www.ebi.ac.uk/~zerbino/velvet/'
        assert box['mailing_list'] == \
            'http://listserver.ebi.ac.uk/mailman/listinfo/velvet-users'
        assert box['image']['dockerhub'] == 'bioboxes/velvet'
        assert box['image']['repo'] == 'https://github.com/bioboxes/velvet'
        assert box['image']['source'] == 'https://github.com/dzerbino/velvet'
        assert box['tasks'][0]['name'] == 'default'
        assert box['tasks'][0]['interface']['name'] == 'assembler'
        assert box['tasks'][1]['name'] == 'careful'
        assert box['tasks'][1]['interface']['name'] == 'assembler'
        assert box['source']['url'] == source_url
        assert box['source']['name'] == 'testname'
        result = self.client.get(
            '/bioboxgui/api/' + version + '/bioboxes',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        data2 = yaml.load(result.data.decode())
        assert data == data2
        result = self.client.get(
            '/bioboxgui/api/' + version + '/bioboxes/velvet',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        data3 = yaml.load(result.data.decode())
        assert data3['biobox'] == box
        result = self.client.get(
            '/bioboxgui/api/' + version + '/bioboxes/18349386',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        data4 = yaml.load(result.data.decode())
        assert data3 == data4
        result = self.client.get(
            '/bioboxgui/api/' + version + '/bioboxes?interface=assembler',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        data5 = yaml.load(result.data.decode())
        for box2 in data5['bioboxes']:
            if box2['title'] == 'velvet':
                break
        else:
            print('done goofed')
        assert box == box2

        result = self.client.get(

            '/bioboxgui/api/' + version + '/bioboxes/hopefullythisisntabiobox',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 404
        result = self.client.get(

            '/bioboxgui/api/' + version + '/bioboxes/1337',
            headers={
                'Authorization': 'Bearer ' + self.token
            }
        )
        assert result.status_code == 404
        result = self.client.get(

            '/bioboxgui/api/' + version + '/bioboxes?interface=notaninterface',
            headers={
                'Authorization': 'Bearer ' + self.token
            }
        )
        assert result.status_code == 404
        result = self.client.get(
            '/bioboxgui/api/' + version + "/bioboxes?interface=' OR 1; " +
            'DROP TABLE BIOBOXES; --',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 404
        result = self.client.get(
            '/bioboxgui/api/' + version + '/bioboxes',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 200


class InterfacesTest(MyTest):
    def test_interfacestuff(self):
        result = self.client.get(
            '/bioboxgui/api/' + version + '/interfaces',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 200
        self.client.post(
            '/bioboxgui/api/' + version + '/sources', data=json.dumps({
                'url': source_url,
                'name': 'testname'
            }),
            headers={
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + self.token
            })
        self.client.put(
            '/bioboxgui/api/' + version + '/bioboxes',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        result = self.client.get(
            '/bioboxgui/api/' + version + '/interfaces',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 200
        data = yaml.load(result.data.decode())
        for interface in data['interfaces']:
            if interface['name'] == 'assembler':
                break
        else:
            print('done goofed')
        assert interface['name'] == 'assembler'


class SourcesTest(MyTest):
    def test_post_get(self):
        result = self.client.get(
            '/bioboxgui/api/' + version + '/sources',
            headers={
                'Authorization': 'Bearer ' + self.token
            })
        source = {
            'url': source_url,
            'name': 'peter'
        }
        result = self.client.post(
            '/bioboxgui/api/' + version + '/sources', data=json.dumps(source),
            headers={
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 201
        data = yaml.load(result.data.decode())
        assert data['url'] == source['url']
        assert data['name'] == source['name']
        result = self.client.post(
            '/bioboxgui/api/' + version + '/sources', data=json.dumps(source),
            headers={
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 400
        source_bad = {
            'url': source_url + 'notathing'
        }
        result = self.client.post(
            '/bioboxgui/api/' + version + '/sources', data=json.dumps(source_bad),
            headers={
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + self.token
            })
        assert result.status_code == 400


if __name__ == '__main__':
    unittest.main()
