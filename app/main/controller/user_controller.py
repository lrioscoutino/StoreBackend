from flask_restful import Resource, reqparse
from app.main.models.user import UserModel
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)
from werkzeug.security import safe_str_cmp



class UserRegisterController(Resource):
    parser = reqparse.RequestParser()  # only allow price changes, no name changes allowed
    parser.add_argument(
        'username',
        type=str,
        required=True,
        help='This field cannot be left blank'
    )
    parser.add_argument(
        'password',
        type=str,
        required=True,
        help='This field cannot be left blank'
    )

    def post(self):
        data = UserRegisterController.parser.parse_args()

        if UserModel.find_by_username(data['username']):
            return {'message': 'UserModel has already been created, aborting.'}, 400

        user = UserModel(**data)
        user.save_to_db()

        return {'message': 'user has been created successfully.'}, 201


class UserLogin(Resource):
    # defining the request parser and expected arguments in the request
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )
    parser.add_argument('password',
                        type=str,
                        required=True,
                        help="This field cannot be blank."
                        )

    def post(self):
        data = self.parser.parse_args()
        # read from database to find the user and then check the password
        user = UserModel.find_by_username(data['username'])

        if user and safe_str_cmp(user.password, data['password']):
            # when authenticated, return a fresh access token and a refresh token
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)
            return {
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 200

        return {"message": "Invalid Credentials!"}, 401