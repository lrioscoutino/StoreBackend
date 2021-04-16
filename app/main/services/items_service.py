import logging
from app.main.models import Item, Store
from app.main.services import StoresService


class ItemsService():

    @classmethod
    def get_all_items(cls):
        items = Item.query.all()
        return items

    @classmethod
    def get_item_by_name(cls, name):
        item = Item.find_by_name(name)
        return item

    @classmethod
    def get_item_by_name_and_store(cls, name, store_id):
        #item = Item.find_by_name(name)
        item = Item.query.filter_by(
            name=name,
            store_id=store_id
        ).first()
        return item

    @classmethod
    def get_item_by_id(cls, item_id):
        item = Item.query.get(item_id)
        return item

    @classmethod
    def create_item(cls, data_item):
        store = StoresService.get_store_by_id(
            data_item.get('store_id')
        )
        item = Item(
            name=data_item.get('name'),
            price=data_item.get('price'),
            store_id=store.id
        )
        item.save_to_db()
        return item

    @classmethod
    def update_item(cls, name, data_item):
        item = cls.get_item_by_name(name)
        if not item:
            item = Item()
        item.name = data_item.get('name')
        item.price = data_item.get('price')
        store = StoresService.get_store_by_id(
            data_item.get('store_id')
        )
        item.store_id = store.id
        item.update_to_db()
        return item

    @classmethod
    def get_items_by_store_id(cls, store_id):
        items = list(map(lambda x: x.json(), Item.query.filter_by(store_id=store_id)))
        # return {'items': [item.json() for item in items]}
        return items

    @classmethod
    def get_items_like_name(cls, store_item):
        logging.info(store_item)
        items = Item.query.filter(
            Item.name.ilike(f"%{store_item}%")
        ).all()
        return items

