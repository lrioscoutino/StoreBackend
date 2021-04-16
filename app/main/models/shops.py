from app.main.db import db


class Shop(db.Model):
    __tablename__ = 'shops'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    address = db.Column(db.String)
    phone = db.Column(db.String)

    def __repr__(self):
        return f'<id {self.id}-{self.name}>'
