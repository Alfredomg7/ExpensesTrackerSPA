from flask import request
from flask_restx import Namespace, Resource, fields
from app.services.expense_service import get_expenses, get_expense, create_expense, update_expense, delete_expense

api = Namespace('expenses', description='Expense operations')

expense_fields = api.model('Expense', {
    'id': fields.Integer(required=True, description='The expense identifier'),
    'name': fields.String(required=True, description='The expense name'),
    'amount': fields.Float(required=True, description='The expense amount'),
    'category': fields.String(required=True, description='The expense category'),
    'date': fields.Date(required=True, description='The expense date')
})

class Expenses(Resource):
    def get(self):
        """Get all expenses"""
        return get_expenses()
    
    @api.doc(body=expense_fields)
    def post(self):
        """Create a new expense"""
        return create_expense(request.json)
    
class Expense(Resource):
    def get(self, expense_id):
        """Get an expense"""
        return get_expense(expense_id)
    
    @api.doc(body=expense_fields)
    def put(self, expense_id):
        """Update an expense"""
        return update_expense(expense_id, request.json)
    
    def delete(self, expense_id):
        """Delete an expense"""
        return delete_expense(expense_id)

api.add_resource(Expenses, '')
api.add_resource(Expense, '/<int:expense_id>')