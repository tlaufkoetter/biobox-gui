import json

import requests
from flask import abort
from flask_restful import marshal, Resource, fields, reqparse

JOB_PROXY_IP = 'http://localhost:9999/v1/jobproxy'

simple_task = {
    'id': fields.String
}

full_task = {
    'description': fields.String,
    'id': fields.String,
    'stderr': fields.String,
    'stdout': fields.String
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
        s = self.reqparse.parse_args(strict=True)
        args = {
            'user': s['user'],
            'container': {
                'image': s['container'],
                'cmd': s['cmd']
            },
            'cores': 1,
            'memory': 128,
            'cputime': 10
        }
        response = requests.post(JOB_PROXY_IP + '/submit', json=args)
        if response.status_code == 200 and response.content:
            return marshal({'id': response.content.decode('utf-8')}, simple_task), 201
        else:
            abort(502)

    def get(self):
        '''
        queries all the tasks.
        :return: json formatted list of tasks.
        '''
        response = requests.get(JOB_PROXY_IP + '/state')
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
        response = requests.post(JOB_PROXY_IP + '/state', task_id)
        if response.status_code == 200 and response.content:
            state = json.loads(response.content.decode('utf-8'))['state']

    def delete(self, task_id):
        '''
        deletes a specific task.
        :param task_id: the task's id
        :return: none
        '''
        abort(502)


class _Container():
    pass
