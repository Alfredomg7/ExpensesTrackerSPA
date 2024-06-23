from app import ma
from app.models.expense import Expense

class ExpenseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Expense
        load_instance = True
        ordered = True

expense_schema = ExpenseSchema()
expenses_schema = ExpenseSchema(many=True)