from flask_testing import TestCase
import unittest
from app.main.db import db
from manage import app


class BaseTestCase(unittest.TestCase):
    """ Base Tests """

    def create_app(self):
        app.config.from_object('app.main.config.TestingConfig')
        return app

    def setUp(self):
        db.create_all()
        db.session.commit()
