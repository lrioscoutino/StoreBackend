import os
import unittest
from flask_testing import TestCase

from manage import app


class TestTestingConfig(TestCase):
    def create_app(self):
        app.config.from_object('app.main.config.TestingConfig')
        return app

    def test_app_is_testing(self):
        self.assertFalse(app.config['SECRET_KEY'] is 'my_precious')
        self.assertTrue(app.config['DEBUG'])
        self.assertTrue(
            app.config['SQLALCHEMY_DATABASE_URI'] == 'postgresql://postgres:testing@localhost:5432/store_backend_test'
        )


if __name__ == '__main__':
    unittest.main()
