

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

function addAmount(){
  
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

// Grab DOM elements for Summary and History List
const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const transactionListEl = document.getElementById('transaction-list');

// 1. Save current array to LocalStorage
function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transaction));
}

// 2. Calculate and render Balance, Total Income, and Total Expense
function updateSummary() {
  let income = 0;
  let expense = 0;

  transaction.forEach(item => {
    if (item.type === 'income') {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });

  const balance = income - expense;

  totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
  totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
  totalBalanceEl.textContent = `₹${balance.toFixed(2)}`;
}

// 3. Render the full transaction list onto the screen
function renderTransactions() {
  transactionListEl.innerHTML = '';

  if (transaction.length === 0) {
    transactionListEl.innerHTML = '<p style="color: #64748b; text-align: center; margin-top: 10px;">No transactions added yet.</p>';
    return;
  }

  transaction.forEach(item => {
    const li = document.createElement('li');
    li.className = `transaction-item ${item.type}`;
    const sign = item.type === 'income' ? '+' : '-';

    li.innerHTML = `
      <div>
        <strong>${item.description}</strong>
        <p style="font-size: 0.8rem; color: #64748b;">${item.category} • ${item.date}</p>
      </div>
      <div>
        <span style="font-weight: 700; margin-right: 12px;">
          ${sign}₹${item.amount.toFixed(2)}
        </span>
        <button onclick="editTransaction('${item.id}')" style="background: none; color: #4f46e5; font-size: 0.85rem; padding: 4px;">Edit</button>
        <button onclick="deleteTransaction('${item.id}')" style="background: none; color: #ef4444; font-size: 0.85rem; padding: 4px;">Delete</button>
      </div>
    `;

    transactionListEl.appendChild(li);
  });
}

transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const category = transactionTypeInput.value === 'income' 
    ? incomeCategory.value 
    : expenseCategory.value;

  const itemData = {
    id: editIdInput.value ? editIdInput.value : Date.now().toString(),
    type: transactionTypeInput.value,
    description: document.getElementById('description').value.trim(),
    amount: parseFloat(document.getElementById('amount').value),
    date: dateInput.value,
    category: category
  };

  if (editIdInput.value) {
    // If editing existing item
    const index = transaction.findIndex(t => t.id === editIdInput.value);
    if (index !== -1) {
      transaction[index] = itemData;
    }
  } else {
    // If adding a new item, add to the front
    transaction.unshift(itemData);
  }

  saveToLocalStorage();
  updateSummary();
  renderTransactions();
  closeModal();
});

// 5. Delete Transaction Handler
window.deleteTransaction = function(id) {
  transaction = transaction.filter(item => item.id !== id);
  saveToLocalStorage();
  updateSummary();
  renderTransactions();
};

// 6. Initialize App on Page Load (Load from LocalStorage)
function initApp() {
  const storedData = localStorage.getItem('transactions');
  if (storedData) {
    transaction = JSON.parse(storedData);
  }
  updateSummary();
  renderTransactions();
}

// Open Modal in Edit Mode
window.editTransaction = function(id) {
  const item = transaction.find(t => t.id === id);
  if (!item) return;

  // Open modal in the item's mode
  openModal(item.type);

  // Fill in existing values
  editIdInput.value = item.id;
  modalHeading.textContent = 'Edit Transaction';
  transactionForm.elements['description'].value = item.description;
  transactionForm.elements['amount'].value = item.amount;
  transactionForm.elements['date'].value = item.date;

  if (item.type === 'income') {
    incomeCategory.value = item.category;
  } else {
    expenseCategory.value = item.category;
  }
};

initApp();

// Analysis Modal DOM Elements
const analysisBtn = document.getElementById('analysis-btn');
const analysisModal = document.getElementById('analysis-modal-container');
const btnCloseAnalysis = document.getElementById('btn-close-analysis');
const monthlyListEl = document.getElementById('monthly-list');

// Function to calculate and render monthly expense summary
function renderMonthlySummary() {
  const monthlyTotals = {};

  // Group expenses by YYYY-MM
  transaction
    .filter(item => item.type === 'expense')
    .forEach(item => {
      const monthKey = item.date.slice(0, 7); // e.g. "2026-10"
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + item.amount;
    });

  const sortedMonths = Object.keys(monthlyTotals).sort().reverse();
  monthlyListEl.innerHTML = '';

  if (sortedMonths.length === 0) {
    monthlyListEl.innerHTML = '<li style="color: #64748b; text-align: center;">No expense history available.</li>';
    return;
  }

  sortedMonths.forEach(monthKey => {
    const [year, month] = monthKey.split('-');
    // Convert to readable month name (e.g., "October 2026")
    const dateObj = new Date(year, month - 1);
    const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.padding = '8px 12px';
    li.style.background = '#f8fafc';
    li.style.borderRadius = '6px';
    li.style.border = '1px solid #e2e8f0';

    li.innerHTML = `
      <span style="font-weight: 500;">${monthName}</span>
      <span style="font-weight: 700; color: #ef4444;">-₹${monthlyTotals[monthKey].toFixed(2)}</span>
    `;

    monthlyListEl.appendChild(li);
  });
}

// Open Analysis Modal
analysisBtn.addEventListener('click', () => {
  renderMonthlySummary();
  analysisModal.classList.remove('hidden');
});

// Close Analysis Modal
btnCloseAnalysis.addEventListener('click', () => {
  analysisModal.classList.add('hidden');
});

// Close when clicking outside on the backdrop
window.addEventListener('click', (e) => {
  if (e.target === analysisModal) {
    analysisModal.classList.add('hidden');
  }
});