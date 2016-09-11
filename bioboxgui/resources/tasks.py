import binascii
import datetime
import hashlib
import json
import os
import re
import time

import requests
import yaml
from flask import abort
from flask_restful import marshal, Resource, fields, reqparse

from bioboxgui import app
from bioboxgui.api import auth, roles_accepted

JOB_PROXY_URL = app.config.get('DOCKER_JP_URL')

simple_task = {
    'id': fields.String
}

full_mount = {
    'host': fields.String,
    'container': fields.String
}

full_mounts = {
    'bbx_file': fields.Nested(full_mount),
    'input_file': fields.Nested(full_mount),
    'outputdir': fields.Nested(full_mount)
}

full_task = {
    'id': fields.String,
    'code': fields.String,
    'mounts': fields.Nested(full_mounts),
    'container': fields.String,
    'box': fields.String,
    'cmd': fields.String
}


class TasksAll(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument(
            'user', type=str, required=True, location='json'
        )
        self.reqparse.add_argument(
            'container', type=str, required=True, location='json'
        )
        self.reqparse.add_argument(
            'cmd', type=str, required=True, location='json'
        )
        self.reqparse.add_argument(
            'file', type=str, required=True, location='json'
        )

    @auth.login_required
    @roles_accepted(['common', 'admin', 'trusted'])
    def post(self):
        '''
        creates a new task.
        :return: string of the task id
        '''
        timestamp = time.time()
        s = self.reqparse.parse_args(strict=True)
        ts = datetime\
            .datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d_%H-%M-%S')
        job = '{}_{}_{}_{}'.format(ts, s['cmd'], s['user'],
                                   str.split(s['container'], '/')[1])
        hash_object = hashlib.pbkdf2_hmac('sha256', job.encode(),
                                          str(timestamp).encode(),
                                          100000, dklen=5)
        job += '_{}'.format(binascii.hexlify(hash_object).decode('utf-8'))
        print(job)
        biobox_yml = {
            'version': '0.9.0',
            'arguments': [
                {
                    'fastq': [
                        {
                            'id': 4,
                            'type': 'paired',
                            'value': '/bbx/input/reads.fq.gz'
                        }
                    ]
                }
            ]
        }
        bbx_file = job + '_biobox.yaml'
        with open(os.path.join(app.config.get('FOLDERS')['bioboxes'],
                               bbx_file), 'w') as file:
            file.write(yaml.dump(biobox_yml))

        args = {
            'user': s['user'],
            'cores': 1,
            'memory': 128,
            'cmd': 'docker run'
                   ' -v {}:/bbx/input/biobox.yaml'
                   ' -v {}:/bbx/input/reads.fq.gz'
                   ' -v {}:/bbx/output'
                   ' {} {}'.format(
                os.path.join(app.config.get('HOST_BASE'),
                             'input', 'bbx_yaml', bbx_file),
                os.path.join(app.config.get('HOST_BASE'), 'input', 'files', s['file']),
                os.path.join(app.config.get('HOST_BASE'), 'output', job),
                s['container'], s['cmd']),
            'cputime': 10
        }

        print(args)

        response = requests.post(JOB_PROXY_URL + '/submit', json=args)
        if response.status_code == 200 and response.content:
            return marshal({
                'id': response.content.decode('utf-8')
            }, simple_task, envelope='state'), 201
        else:
            abort(502)

    @auth.login_required
    @roles_accepted(['common', 'trusted', 'admin'])
    def get(self):
        '''
        queries all the tasks.
        :return: json formatted list of tasks.
        '''
        try:
            response = requests.get(JOB_PROXY_URL + '/state')
        except:
            abort(502)

        if response.status_code == 200 and response.content:
            states = json.loads(response.content.decode('utf-8'))['state']
            docker_patter = re.compile(
                '^docker run ' +
                '-v (?P<inbbxhost>[^ :]+):(?P<inbbxcontainer>[^ :]+) ' +
                '-v (?P<inrhost>[^ :]+):(?P<inrcontainer>[^ :]+) ' +
                '-v (?P<outhost>[^ :]+):(?P<outcontainer>[^ :]+) ' +
                '(?P<box>\w+/\w+) (?P<cmd>\w+)'
            )
            result = []
            for state in states:
                description = str.strip(state['description'])
                res = re.fullmatch(docker_patter, description)
                if res:
                    status_code = state['code']
                    if status_code == '0':
                        status_code = 'SUCCESS'
                    elif status_code == '1':
                        status_code = 'FAILED'
                    elif status_code == '2':
                        status_code = 'RUNNING'
                    else:
                        status_code = 'UNKNOWN'

                    result.append({
                        'id': state['id'],
                        'code': status_code,
                        'mounts': {
                            'bbx_file': {
                                'host': res.group('inbbxhost'),
                                'container': res.group('inbbxcontainer')
                            },
                            'input_file': {
                                'host': res.group('inrhost'),
                                'container': res.group('inrcontainer')
                            },
                            'outputdir': {
                                'host': res.group('outhost'),
                                'container': res.group('outcontainer')
                            }
                        },
                        'box': res.group('box'),
                        'cmd': res.group('cmd')
                    })

            return marshal(result, full_task, envelope='states')
        else:
            abort(502)


class TaskId(Resource):
    @auth.login_required
    @roles_accepted(['common', 'trusted', 'admin'])
    def get(self, task_id):
        '''
        queries the state of given task.
        :param task_id: the id of the task to query.
        :return: json formatted task state
        '''
        response = requests.post(JOB_PROXY_URL + '/state', task_id)
        if response.status_code == 200 and response.content:
            state = json.loads(response.content.decode('utf-8'))['state']
            return marshal(state, full_task, envelope='state')
        else:
            abort(404)

    @auth.login_required
    @roles_accepted(['trusted', 'admin'])
    def delete(self, task_id):
        '''
        deletes a specific task.
        :param task_id: the task's id
        :return: none
        '''
        reponse = requests.delete(JOB_PROXY_URL +
                                  '/delete/' +
                                  task_id)
        if reponse.status_code == 204:
            return None, 204
        else:
            abort(502)
