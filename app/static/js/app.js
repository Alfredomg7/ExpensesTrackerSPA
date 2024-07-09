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

        let monthTotal = 0;
        let weekTotal = 0;
 
        const currentDate = new Date();
        const monthTotals = {};
        const weekTotals = {};

        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            const monthKey = `${expenseDate.getFullYear()}-${expenseDate.getMonth()}`;
            const weekKey = `${expenseDate.getFullYear()}-${getWeekNumber(expenseDate)}`;
            
            if (!monthTotals[monthKey]) {
                monthTotals[monthKey] = 0;
            }
            monthTotals[monthKey] += parseFloat(expense.amount);

            if (!weekTotals[weekKey]) {
                weekTotals[weekKey] = 0;
            }
            weekTotals[weekKey] += parseFloat(expense.amount);

            if (expenseDate.getMonth() === currentDate.getMonth()) {
                monthTotal += parseFloat(expense.amount);
            }
            
            if (getWeekNumber(expenseDate) === getWeekNumber(currentDate)) {
                weekTotal += parseFloat(expense.amount);
            }
        
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

        const monthAverage = Object.keys(monthTotals).length ? (Object.values(monthTotals).reduce((a, b) => a + b, 0) / Object.keys(monthTotals).length) : 0;
        const weekAverage = Object.keys(weekTotals).length ? (Object.values(weekTotals).reduce((a, b) => a + b, 0) / Object.keys(weekTotals).length) : 0;
    
        document.getElementById('month-total-expense').innerText = formatCurrency(monthTotal);
        document.getElementById('monthly-avg-expense').innerText = formatCurrency(monthAverage);
        document.getElementById('week-total-expense').innerText = formatCurrency(weekTotal);
        document.getElementById('weekly-avg-expense').innerText = formatCurrency(weekAverage);

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

    // create function to get week from date
    function getWeekNumber(date) {
        const onejan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    loadExpenses();
});

