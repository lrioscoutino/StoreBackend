from flask import Flask, jsonify, request, abort
from flask_restful import Resource, reqparse
from flask_jwt import jwt_required
from app.main.models.item import Item
from app.main.services import ItemsService
from flask_restful_swagger import swagger


# Section 6
class ItemControllerCreate(Resource):
    parser = reqparse.RequestParser()  # only allow price changes, no name changes allowed
    parser.add_argument('price', type=float, required=True, help='This field cannot be left blank')
    parser.add_argument('name', type=str, required=True, help='Must enter the item name')
    parser.add_argument('store_id', type=int, required=True, help='Must enter the store id')

    # @jwt_required()
    def post(self):
        """
            This method make a POST request to create a Item
            payload:
            {
            'name': String,
            'price': Integer,
            'store_id': Id Store
            }
        """
        data = ItemControllerCreate.parser.parse_args()
        name = data.get('name')
        store_id = data.get('store_id')
        item = ItemsService.get_item_by_name_and_store(
            name,
            store_id
        )
        if item:
            return {'message': f"In this Store {item.store.name} An item with name '{name}' already exists."}, 400

        try:
            item = ItemsService.create_item(
                data
            )
        except Exception as err:
            return {"message": f"An error occurred inserting the item. {err}"}, 500

        return item.json(), 201


class ItemController(Resource):
    parser = reqparse.RequestParser()  # only allow price changes, no name changes allowed
    parser.add_argument('price', type=float, required=True, help='This field cannot be left blank')
    parser.add_argument('name', type=str, required=True, help='Must enter the item name')
    parser.add_argument('store_id', type=int, required=True, help='Must enter the store id')

    #@jwt_required()  # Requires dat token
    def get(self, item_id):
        """
            This method make a login request to get the user access token
            and set adviser_id & token variables
        """
        item = ItemsService.get_item_by_id(item_id)
        if item:
            return item.json()
        return {'message': 'Item not found'}, 404

    @jwt_required()
    def delete(self, item_id):

        item = ItemsService.get_item_by_id(item_id)
        if item:
            item.delete_from_db()

            return {'message': 'item has been deleted'}

    #@jwt_required()
    def put(self, item_id):
        data = ItemController.parser.parse_args()
        item = ItemsService.get_item_by_id(item_id)

        item = ItemsService.update_item(
            item.name,
            data
        )

        return item.json()


class ItemListController(Resource):
    @jwt_required()
    def get(self, store_id):
        items = ItemsService.get_items_by_store_id(store_id)
        return {'items': items}
