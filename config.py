import os
import sys
from subprocess import check_output

basedir = os.path.abspath(os.path.dirname(__file__))
hostbase = os.environ.get('DOCKER_HOST_BASE')
hostbase = basedir if not hostbase else hostbase

DOCKER = len(sys.argv) > 1 and '--docker' in sys.argv[1:]

DOCKER_JP_URL = os.environ.get('DOCKER_JP_URL')
if not DOCKER_JP_URL:
    DOCKER_JP_URL = 'http://'
    if DOCKER:
        route_out = check_output(["/sbin/ip", "route"]).decode()
        DOCKER_JP_URL += str.split(route_out, ' ')[2]
    else:
        DOCKER_JP_URL += 'localhost'
    DOCKER_JP_URL += ':9999/v1/jobproxy'

FOLDERS = {
    'db': os.path.join(basedir, 'db'),
    'data': os.path.join(basedir, 'data'),
    'input': os.path.join(basedir, 'data', 'input'),
    'bioboxes': os.path.join(basedir, 'data', 'input', 'bbx_yaml'),
    'output': os.path.join(basedir, 'data', 'output')
}
HOST_BASE = os.path.join(hostbase, 'data')
TESTING = False

for name, folder in FOLDERS.items():
    os.makedirs(folder, exist_ok=True)

SECRET_KEY = 'super-duper-secret'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db', 'bioboxgui.db')
# SECURITY_LOGIN_URL = '/bioboxgui/api/token'
# SECURITY_LOGOUT_URL = '/bioboxgui/api/logout'
SECURITY_PASSWORD_HASH = 'pbkdf2_sha512'
SECURITY_PASSWORD_SALT = 'even-secreter'

WTF_CSRF_ENABLED = False
