import os
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask import Flask, jsonify, redirect, render_template
from flask_restful import Api
from flask_jwt import JWT
from app.config import postgresqlConfig
from app.blueprint import blueprint
from app.main.controller import (
    StoreController,
    StoreControllerCreate,
    StoreListController,
    ItemController,
    ItemControllerCreate,
    ItemListController,
    UserRegisterController,
    StoreSearchController,
)
from app.security import authenticate, identity
from flask_swagger import swagger
from flask_swagger_ui import get_swaggerui_blueprint
from flask_restful_swagger import swagger


template_dir = os.path.dirname(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
template_dir = os.path.join(template_dir, 'shop/templates')
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = postgresqlConfig
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'Dese.Decent.Pups.BOOYO0OST'


@app.route("/")
def home():
    return render_template("base.html")


@app.route("/manage-stores")
def manage_stores():
    return render_template("stores.html")


@app.route("/manage-items")
def manage_items():
    return render_template("items.html")


@app.before_first_request
def create_tables():
    db.create_all()


api = Api(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWT(app, authenticate, identity)  # Auto Creates /auth endpoint

api.add_resource(ItemControllerCreate, '/item/create')
api.add_resource(ItemController, '/item/<string:item_id>')
api.add_resource(ItemListController, '/items/<string:store_id>')
api.add_resource(UserRegisterController, '/register')

api.add_resource(StoreControllerCreate, '/store/create')
api.add_resource(StoreController, '/store/<string:store_id>')
api.add_resource(StoreListController, '/stores')
api.add_resource(StoreSearchController, '/stores/search/<string:store_name>')

if __name__ == '__main__':
    from app.main.db import db
    db.init_app(app)
    app.run(host="0.0.0.0", debug=True)
