import { fetchExpenses, addExpense, deleteExpense, updateExpense, fetchExpense } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const expenseId = document.getElementById('expenseId');
    const expenseFormSubmit = document.getElementById('expenseFormSubmit');
    const expensesTableBody = document.getElementById('expensesTableBody');

    // Event listener for form submission
    expenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const expense = {
            name: document.getElementById('expenseName').value,
            amount: document.getElementById('expenseAmount').value,
            category: document.getElementById('expenseCategory').value,
            date: document.getElementById('expenseDate').value
        };

        if (expenseId.value) {
            await updateExpense(expenseId.value, expense);
            expenseFormSubmit.textContent = 'Add Expense';
        } else {
            await addExpense(expense);
        }

        expenseForm.reset();
        expenseId.value = '';
        loadExpenses();
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const loadExpenses = async () => {
        const expenses = await fetchExpenses();
        expensesTableBody.innerHTML = '';

        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${formatCurrency(expense.amount)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="btn btn-danger btn-md delete-expense" data-id="${expense.id}">Delete</button>
                    <button class="btn btn-info btn-md edit-expense" data-id="${expense.id}">Edit</button>
                </td>
            `;
            expensesTableBody.appendChild(row);
        });

        document.querySelectorAll('.delete-expense').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                await deleteExpense(id);
                loadExpenses();
            });
        });

        document.querySelectorAll('.edit-expense').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                const expense = await fetchExpense(id);
                populateEditForm(expense);
            });
        });
    };

    function populateEditForm(expense) {
        expenseId.value = expense.id;
        document.getElementById('expenseName').value = expense.name;
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseDate').value = expense.date;
        expenseFormSubmit.textContent = 'Save Changes';
    }

    loadExpenses();
});
