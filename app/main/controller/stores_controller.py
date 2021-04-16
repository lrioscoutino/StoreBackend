from flask_restful import Resource, reqparse
from app.main.services import StoresService
from app.main.models.stores import Store
from flask_jwt import jwt_required


class StoreControllerCreate(Resource):
    parser = reqparse.RequestParser()  # only allow price changes, no name changes allowed
    parser.add_argument('name', type=str, required=True, help='Must enter the store name.')
    parser.add_argument('address', type=str, required=True, help='Must enter the store address')
    parser.add_argument('phone', type=str, required=True, help='Must enter the store phone')

    @jwt_required()
    def post(self):
        data = StoreControllerCreate.parser.parse_args()
        name = data.get('name')
        if StoresService.get_store_by_name(name):
            return {'message': "A store with name '{}' already exists.".format(name)}, 400

        store = StoresService.create_store(data)
        return store.json(), 201


class StoreController(Resource):
    parser = reqparse.RequestParser()  # only allow price changes, no name changes allowed
    parser.add_argument('name', type=str, required=True, help='Must enter the store name.')
    parser.add_argument('address', type=str, required=True, help='Must enter the store address')
    parser.add_argument('phone', type=str, required=True, help='Must enter the store phone')

    @jwt_required()
    def get(self, store_id):
        store = StoresService.get_store_by_id(store_id)
        if store:
            return store.json()
        return {'message': 'Store not found'}, 404


    @jwt_required()
    def put(self, store_id):
        data = StoreController.parser.parse_args()
        store = StoresService.update_store(store_id, data)
        return store.json(), 201

    @jwt_required()
    def delete(self, store_id):
        store = StoresService.get_items_by_store_id(store_id)
        if store.json().get('items'):
            return {'message': "Store with Items"}, 400

        StoresService.delete_store_by_id(store_id)
        return {'message': 'Store deleted'}



class StoreListController(Resource):
    #@jwt_required()
    def get(self):
        stores = StoresService.get_all_stores()
        return {'stores': [store.json() for store in stores]}

class StoreSearchController(Resource):
    #@jwt_required()
    def get(self, store_name):
        stores = StoresService.get_store_like_name(store_name)

        return {'stores': [store.json() for store in stores]}
