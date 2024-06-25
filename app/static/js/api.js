const apiUrl = '/api/expenses';

export const fetchExpenses = async () => {
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
};

export const addExpense = async (expense) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding expense:', error);
    }
};

export const deleteExpense = async (id) => {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
};

export const updateExpense = async (id, expense) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating expense:', error);
    }
};

export const fetchExpense = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching expense:', error);
    }
};
