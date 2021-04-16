import logging
from app.main.models import Store


class StoresService():

    @classmethod
    def get_all_stores(cls):
        stores = Store.query.all()
        return stores

    @classmethod
    def get_store_by_name(cls, name):
        store = Store.find_by_name(name)
        return store

    @classmethod
    def delete_store_by_name(cls, name):
        store = Store.find_by_name(name=name)
        if store:
            store.delete_from_db()

        return store

    @classmethod
    def get_store_by_id(cls, store_id):
        store = Store.query.get(store_id)

        if not store:
            raise Exception(f'No se encotró la tienda con ese id. {store_id}')

        return store

    @classmethod
    def create_store(cls, data_store):
        store = Store(
            name=data_store.get('name'),
            address=data_store.get('address'),
            phone=data_store.get('phone')
        )
        try:
            store.save_to_db()
        except:
            return {"message": "An error occurred creating the store."}, 500

        return store

    @classmethod
    def update_store(cls, store_id, data_store):
        store = cls.get_store_by_id(store_id)
        store.name =data_store.get('name')
        store.address=data_store.get('address')
        store.phone=data_store.get('phone')
        try:
            store.update_to_db()
        except:
            return {"message": "An error occurred creating the store."}, 500

        return store

    @classmethod
    def delete_store_by_id(cls, store_id):
        store = cls.get_store_by_id(store_id)
        if store:
            store.delete_from_db()

        return store

    @classmethod
    def get_items_by_store_id(cls,store_id):
        store = cls.get_store_by_id(store_id)

        return store


    @classmethod
    def get_store_like_name(cls, store_name):
        logging.info(store_name)
        stores = Store.query.filter(Store.name.ilike(f"%{store_name}%")).all()
        return stores



