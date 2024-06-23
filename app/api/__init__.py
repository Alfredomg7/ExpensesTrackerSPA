from flask import Blueprint
from flask_restx import Api
from app.api.expenses import api as expenses_api 

api_bp = Blueprint('api', __name__, url_prefix='/api')

api = Api(api_bp, version='1.0', title='Expenses API', description='A simple RESTful API to manage expenses')

api.add_namespace(expenses_api, path='/expenses')