import binascii
import datetime
import hashlib
import json
import os
import time

import requests
import yaml
from bioboxgui import app
from flask import abort
from flask_restful import marshal, Resource, fields, reqparse

JOB_PROXY_URL = app.config.get('DOCKER_JP_URL')

simple_task = {
    'id': fields.String
}

full_task = {
    'description': fields.String,
    'id': fields.String,
    'stderr': fields.String,
    'stdout': fields.String,
    'code': fields.String
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

    def post(self):
        '''
        creates a new task.
        :return: string of the task id
        '''
        timestamp = time.time()
        s = self.reqparse.parse_args(strict=True)
        ts = datetime.datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d_%H-%M-%S')
        job = '{}_{}_{}_{}'.format(ts, s['cmd'], s['user'],
                                   str.split(s['container'], '/')[1])
        hash_object = hashlib.pbkdf2_hmac('sha256', job.encode(), str(timestamp).encode(), 100000, dklen=5)
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
        with open(os.path.join(app.config.get('FOLDERS')['bioboxes'], bbx_file), 'w') as file:
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
                os.path.join(app.config.get('HOST_BASE'), 'input', 'bbx_yaml', bbx_file),
                os.path.join(app.config.get('HOST_BASE'), 'input', s['file']),
                os.path.join(app.config.get('HOST_BASE'), 'output', job),
                s['container'], s['cmd']),
            'cputime': 10
        }
        print(args)

        response = requests.post(JOB_PROXY_URL + '/submit', json=args)
        if response.status_code == 200 and response.content:
            return marshal({'id': response.content.decode('utf-8')}, simple_task), 201
        else:
            abort(502)

    def get(self):
        '''
        queries all the tasks.
        :return: json formatted list of tasks.
        '''
        response = requests.get(JOB_PROXY_URL + '/state')
        if response.status_code == 200 and response.content:
            states = json.loads(response.content.decode('utf-8'))['state']
            return marshal(states, full_task, envelope='states')
        else:
            abort(502)


class TaskId(Resource):
    def get(self, task_id):
        '''
        queries the state of given task.
        :param task_id: the id of the task to query.
        :return: json formatted task state
        '''
        response = requests.post(JOB_PROXY_URL + '/state', task_id)
        if response.status_code == 200 and response.content:
            state = json.loads(response.content.decode('utf-8'))['state']

    def delete(self, task_id):
        '''
        deletes a specific task.
        :param task_id: the task's id
        :return: none
        '''
        abort(502)
