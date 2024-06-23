import { fetchExpenses, addExpense, deleteExpense } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const expensesTableBody = document.getElementById('expensesTableBody');
    
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
                    <button class="btn btn-danger btn-sm delete-expense" data-id="${expense.id}">Delete</button>
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
    };

    expenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const expense = {
            name: document.getElementById('expenseName').value,
            amount: document.getElementById('expenseAmount').value,
            category: document.getElementById('expenseCategory').value,
            date: document.getElementById('expenseDate').value
        };

        await addExpense(expense);
        expenseForm.reset();
        loadExpenses();
    });

    loadExpenses();
});
