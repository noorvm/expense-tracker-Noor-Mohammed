

let transaction = []

const CATEGORIES = {
    income: [],
    expense: []
}

const modalContainer = document.getElementById('modal-container');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnAddIncome = document.getElementById('btn-add-income');
const btnAddExpense = document.getElementById('btn-add-expense');

const modalHeading = document.getElementById('modal-heading');
const transactionForm = document.getElementById('transaction-form');
const transactionTypeInput = document.getElementById('transaction-type');
const editIdInput = document.getElementById('edit-id');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');