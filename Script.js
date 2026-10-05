

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
const expenseCategory = document.getElementById('expense-category');
const incomeCategory = document.getElementById('income-category');
const dateInput = document.getElementById('date');


function switchCategoryDropdown(type) {
  if (type === 'income') {
    incomeCategory.classList.remove('hidden');
    incomeCategory.disabled = false;

    expenseCategory.classList.add('hidden');
    expenseCategory.disabled = true;
  } else {
    expenseCategory.classList.remove('hidden');
    expenseCategory.disabled = false;

    incomeCategory.classList.add('hidden');
    incomeCategory.disabled = true;
  }
}


function openModal(type) {
  transactionForm.reset();
  editIdInput.value = '';
  transactionTypeInput.value = type;

  dateInput.value = new Date().toISOString().split('T')[0];

  modalHeading.textContent = type === 'income' ? 'Add Income' : 'Add Expense';
  switchCategoryDropdown(type);

  modalContainer.classList.remove('hidden');
}


function closeModal() {
  modalContainer.classList.add('hidden');
}

btnAddIncome.addEventListener('click', () => openModal('income'));
btnAddExpense.addEventListener('click', () => openModal('expense'));
btnCloseModal.addEventListener('click', closeModal);

// Close when clicking outside the modal box
window.addEventListener('click', (e) => {
  if (e.target === modalContainer) {
    closeModal();
  }
});