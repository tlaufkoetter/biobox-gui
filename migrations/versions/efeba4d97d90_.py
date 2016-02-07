"""initial database setup.

Revision ID: efeba4d97d90
Revises: None
Create Date: 2016-02-07 00:11:22.720229

"""

# revision identifiers, used by Alembic.
revision = 'efeba4d97d90'
down_revision = None

import sqlalchemy as db
from alembic import op


def upgrade():
    op.create_table(
        'biobox',
        db.Column('pmid', db.Integer(), nullable=False),
        db.Column('title', db.String(), nullable=False),
        db.Column('homepage', db.String(), nullable=True),
        db.Column('mailing_list', db.String(), nullable=True),
        db.Column('description', db.String(), nullable=False),
        db.PrimaryKeyConstraint('pmid'),
        db.UniqueConstraint('title')
    )
    op.create_table(
        'task',
        db.Column('id', db.Integer(), nullable=False),
        db.Column('name', db.String(), nullable=False),
        db.Column('interface', db.String(), nullable=False),
        db.PrimaryKeyConstraint('id')
    )
    op.create_table(
        'association',
        db.Column('biobox_id', db.Integer(), nullable=True),
        db.Column('task_id', db.Integer(), nullable=True),
        db.ForeignKeyConstraint(['biobox_id'], ['biobox.pmid'], ),
        db.ForeignKeyConstraint(['task_id'], ['task.id'], )
    )
    op.create_table(
        'image',
        db.Column('id', db.Integer(), nullable=False),
        db.Column('dockerhub', db.String(), nullable=False),
        db.Column('repo', db.String(), nullable=False),
        db.Column('source', db.String(), nullable=True),
        db.Column('biobox_id', db.Integer(), nullable=False),
        db.ForeignKeyConstraint(['biobox_id'], ['biobox.pmid'], ),
        db.PrimaryKeyConstraint('id'),
        db.UniqueConstraint('dockerhub'),
        db.UniqueConstraint('repo')
    )


def downgrade():
    op.drop_table('image')
    op.drop_table('association')
    op.drop_table('task')
    op.drop_table('biobox')
