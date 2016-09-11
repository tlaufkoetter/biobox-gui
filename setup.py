# coding=utf-8
try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

with open("README.md", 'r') as readme:
    readme = readme.read()

with open('requirements.txt', 'r') as requirements:
    requirements = requirements.read().splitlines()

setup(
        name="bioboxgui",
        version="0.1.0",
        packages=[
            'bioboxgui'
        ],
        author='Tobias Laufkötter',
        url='https://github.com/tlaufkoetter/biobox-gui',
        license="Apache 2.0 License",
        long_desctiption=readme,
        install_requires=requirements,
    scripts=[]
)
