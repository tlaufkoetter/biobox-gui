import os

basedir = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = 'super-duper-secret'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'bioboxgui.db')
SECURITY_LOGIN_URL = '/bioboxgui/api/token'
SECURITY_LOGOUT_URL = '/bioboxgui/api/logout'
SECURITY_PASSWORD_HASH = 'pbkdf2_sha512'
SECURITY_PASSWORD_SALT = 'even-secreter'
WTF_CSRF_ENABLED = False
