from app import db
from app.models.expense import Expense
from app.schemas.expense import expense_schema, expenses_schema
from datetime import datetime

def get_expenses():
    expenses = Expense.query.all()
    return expenses_schema.dump(expenses), 200

def get_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if expense:
        return expense_schema.dump(expense), 200
    else:
        return {"message": "Expense not found"}, 404

def create_expense(request_data):
    new_expense = Expense(
        name = request_data['name'],
        amount = request_data['amount'],
        category = request_data['category'],
        date = datetime.strptime(request_data['date'], '%Y-%m-%d').date()
    )
    db.session.add(new_expense)
    db.session.commit()
    return expense_schema.dump(new_expense), 201

def update_expense(expense_id, request_data):
    expense = Expense.query.get(expense_id)
    if expense:
        expense.name = request_data.get('name', expense.name)
        expense.amount = request_data.get('amount', expense.amount)
        expense.category = request_data.get('category', expense.category)
        expense.date = datetime.strptime(request_data.get('date', expense.date), '%Y-%m-%d').date()
        db.session.commit()
        return expense_schema.dump(expense), 200
    else:
        return {"message": "Expense not found"}, 404

def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if expense:
        db.session.delete(expense)
        db.session.commit()
        return {"message": "Expense deleted"}, 200
    else:
        return {"message": "Expense not found"}, 404