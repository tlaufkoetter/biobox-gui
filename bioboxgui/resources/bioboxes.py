from flask_restful import marshal, Resource

from bioboxgui import models
from bioboxgui.resources import regular_biobox, minimal_biobox


class BioboxesAll(Resource):
    def get(self):
        """
        queries a list of available bioboxes.

        will be empty when no bioboxes are stored.
        :return: json formatted bioboxes.
        """
        return get_all_bioboxes()


class BioboxesUpdate(Resource):
    def get(self):
        """
        updates the stored bioboxes.

        :return: json formatted bioboxes.
        """
        models.refresh()
        return get_all_bioboxes()


class BioboxId(Resource):
    def get(self, biobox_id):
        """
        fetches a single biobox with the given id.

        :param biobox_id: the pmid of the biobox.
        :return: a json formatted biobox.
        """
        result = models.Biobox.query.get(biobox_id)
        return {
            'biobox': marshal(result, regular_biobox) if result else None
        }


class BioboxName(Resource):
    def get(self, biobox_name):
        """
        fetches a single biobox with the given id.

        :param biobox_id: the pmid of the biobox.
        :return: a json formatted biobox.
        """
        result = models.Biobox.query.filter(models.Biobox.title == biobox_name).first()
        return {
            'biobox': marshal(result, regular_biobox) if result else None
        }


def get_all_bioboxes():
    bioboxes = models.Biobox.query.order_by(models.Biobox.title).all()
    return {
        'bioboxes': marshal(bioboxes, minimal_biobox)
    }
