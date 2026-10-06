
# 💰 Expense Tracker

A simple and responsive **Expense Tracker web application** built using **HTML, CSS, and JavaScript**.

This application allows users to record their income and expenses, organize transactions by category, view their current balance, edit or delete transactions, and analyze expenses month by month.

The application uses the browser's **LocalStorage** to save transaction data, so the data remains available even after refreshing or reopening the browser.

---

## 📌 Project Overview

The Expense Tracker is a frontend-based personal finance management application.

Users can:

* Add income
* Add expenses
* Select transaction categories
* Enter transaction descriptions
* Enter transaction amounts
* Select transaction dates
* View total income
* View total expenses
* View current balance
* Edit existing transactions
* Delete transactions
* View transaction history
* View monthly expense analysis
* Automatically save transactions using LocalStorage

The application does not require a backend or database.

All transaction data is stored locally in the user's browser.

---

## 🚀 Features

### 1. Add Income

Users can add an income transaction by entering:

* Description
* Amount
* Date
* Income category

Available income categories:

* Salary
* Investments
* Other

When an income is added, the total income and current balance are automatically updated.

---

### 2. Add Expense

Users can add an expense transaction by entering:

* Description
* Amount
* Date
* Expense category

Available expense categories:

* Food
* Transportation
* Rent & Bills
* Other

The expense is immediately added to the transaction history and the total expense and balance are recalculated.

---

### 3. Current Balance

The current balance is calculated using:

```text
Current Balance = Total Income - Total Expenses
```

For example:

```text
Total Income   = ₹20,000
Total Expenses = ₹8,000

Current Balance = ₹12,000
```

The balance is recalculated whenever a transaction is added, edited, or deleted.

---

### 4. Transaction History

All saved transactions are displayed in the **Transaction History** section.

Each transaction displays:

* Description
* Category
* Date
* Amount
* Edit button
* Delete button

Income transactions are displayed with a positive `+` sign, while expenses are displayed with a negative `-` sign.

---

### 5. Edit Transactions

Existing transactions can be edited.

When the user clicks the **Edit** button:

1. The application finds the selected transaction using its ID.
2. The transaction modal is opened.
3. Existing transaction information is loaded into the form.
4. The user can modify the information.
5. After submitting, the existing transaction is updated.
6. LocalStorage is updated.
7. The summary and transaction list are refreshed.

---

### 6. Delete Transactions

Users can delete any transaction using the **Delete** button.

When a transaction is deleted:

1. The transaction is removed from the JavaScript array.
2. The updated array is saved to LocalStorage.
3. Total income and expenses are recalculated.
4. The current balance is updated.
5. The transaction history is re-rendered.

---

### 7. LocalStorage

The application uses the browser's **LocalStorage API** to save transaction data.

The transaction array is converted into JSON using:

```javascript
JSON.stringify(transaction)
```

and stored in LocalStorage.

When the application starts, the stored JSON data is retrieved and converted back into a JavaScript array using:

```javascript
JSON.parse(storedData)
```

The storage key used by the application is:

```text
transactions
```

This means the transactions are preserved when the page is refreshed.

> Note: LocalStorage is browser-specific. The data is stored locally on the user's device/browser and is not synchronized with a server or another device.

---

## 📊 Monthly Expense Analysis

The application includes an **Analysis** feature.

The analysis groups expense transactions according to their month.

For example:

```text
October 2026    -₹8,500.00
September 2026  -₹6,200.00
August 2026     -₹7,100.00
```

The application:

1. Filters only expense transactions.
2. Extracts the year and month from each transaction date.
3. Groups expenses using the `YYYY-MM` format.
4. Adds the expenses belonging to the same month.
5. Sorts the months from newest to oldest.
6. Displays the monthly expense total.

---

## 🛠️ Technologies Used

### HTML5

HTML is used to create the structure of the application.

It contains:

* Page heading
* Summary cards
* Income and expense buttons
* Transaction form
* Input fields
* Category dropdowns
* Transaction history
* Analysis modal

---

### CSS3

CSS is used for the visual design and layout.

The stylesheet provides:

* Page layout
* Summary cards
* Buttons
* Transaction cards
* Modal windows
* Form styling
* Colors for income and expenses
* Spacing and typography
* Responsive layout

The application uses CSS Grid and Flexbox for layout.

---

### JavaScript

JavaScript provides the application's functionality.

It handles:

* Adding transactions
* Editing transactions
* Deleting transactions
* Calculating totals
* Rendering transactions
* Opening and closing modals
* Handling forms
* LocalStorage
* Monthly expense analysis
* Updating the DOM dynamically

---

## 📁 Project Structure

```text
expense-tracker-Noor-Mohammed/
│
├── index.html
├── style.css
├── Script.js
└── README.md
```

---

## 📄 File Explanation

### `index.html`

`index.html` is the main structure of the application.

It contains the following major sections:

#### Page Header

```html
<h1>Expense Tracker</h1>
```

Displays the application title.

#### Summary Section

The summary section displays:

* Current Balance
* Total Income
* Total Expense

These values are updated dynamically by JavaScript.

The elements have IDs so JavaScript can access them:

```html
<p id="total-balance">0.00</p>
<p id="total-income">0.00</p>
<p id="total-expense">0.00</p>
```

#### Add Transaction Buttons

```html
<button id="btn-add-income">add income</button>
<button id="btn-add-expense">add expense</button>
```

These buttons open the transaction form in income or expense mode.

#### Transaction Form

The form collects:

```text
Description
Amount
Date
Category
```

The amount input uses:

```html
step="0.01"
min="0.01"
```

This allows decimal amounts while preventing values below `0.01`.

#### Category Dropdowns

There are separate dropdowns for income and expenses.

Income:

```text
Salary
Investments
Other
```

Expense:

```text
Food
Transportation
Rent & Bills
Other
```

JavaScript displays the appropriate dropdown depending on whether the user is adding an income or expense.

#### Transaction History

```html
<ul id="transaction-list"></ul>
```

JavaScript dynamically creates the transaction elements and inserts them into this list.

#### Analysis Section

The Analysis button opens a modal containing the monthly expense summary.

---

### `style.css`

`style.css` controls the appearance of the application.

It styles:

* Main page
* Summary cards
* Buttons
* Transaction cards
* Income/expense indicators
* Forms
* Input fields
* Dropdowns
* Modals
* Analysis section

Income transactions use a green visual indicator, while expense transactions use a red indicator.

The application also uses a centered layout with a maximum width, making the interface easier to use on different screen sizes.

---

### `Script.js`

`Script.js` contains the main application logic.

The major responsibilities of this file are explained below.

---

## 🧠 JavaScript Logic

### Transaction Array

The application starts with:

```javascript
let transaction = [];
```

This array holds all transaction objects.

Each transaction contains information such as:

```javascript
{
    id: "123456789",
    type: "expense",
    description: "Lunch",
    amount: 250,
    date: "2026-10-06",
    category: "Food"
}
```

---

### Opening the Modal

The `openModal()` function opens the transaction form.

It:

* Resets the form
* Sets the transaction type
* Sets the current date
* Changes the modal heading
* Displays the appropriate category dropdown
* Makes the modal visible

The application supports two transaction types:

```text
income
expense
```

---

### Switching Categories

The `switchCategoryDropdown()` function determines which category dropdown should be displayed.

For an income:

```text
Income Category → visible
Expense Category → hidden
```

For an expense:

```text
Expense Category → visible
Income Category → hidden
```

---

### Saving Transactions

When the transaction form is submitted, JavaScript creates a transaction object.

The transaction receives a unique ID using:

```javascript
Date.now().toString()
```

The transaction is then added to the array.

New transactions are added to the beginning of the array using:

```javascript
transaction.unshift(itemData);
```

This allows the newest transaction to appear first.

---

### Updating the Summary

The `updateSummary()` function calculates:

```text
Total Income
Total Expenses
Current Balance
```

It loops through every transaction.

For income:

```javascript
income += item.amount;
```

For expenses:

```javascript
expense += item.amount;
```

Then:

```javascript
const balance = income - expense;
```

The calculated values are displayed in the summary section.

---

### Rendering Transactions

The `renderTransactions()` function displays all transactions on the page.

It first clears the existing transaction list and then loops through the transaction array.

For every transaction it creates an HTML list item containing:

* Description
* Category
* Date
* Amount
* Edit button
* Delete button

The DOM is therefore updated dynamically without manually writing each transaction into HTML.

---

### Editing a Transaction

The `editTransaction()` function searches for a transaction using its ID.

It then:

1. Finds the transaction.
2. Opens the modal.
3. Changes the modal heading to `Edit Transaction`.
4. Loads the existing description.
5. Loads the amount.
6. Loads the date.
7. Loads the category.
8. Stores the transaction ID in the hidden edit field.

When the form is submitted, JavaScript recognizes that an existing transaction is being edited and replaces the old transaction data.

---

### Deleting a Transaction

The `deleteTransaction()` function removes a transaction using its ID.

It uses:

```javascript
transaction.filter(item => item.id !== id)
```

This creates a new array containing all transactions except the selected transaction.

After deletion, the application:

```text
Updates LocalStorage
Updates the summary
Re-renders the transaction list
```

---

## 💾 Data Flow

The basic application flow is:

```text
User enters transaction
        ↓
Form submission
        ↓
JavaScript creates transaction object
        ↓
Transaction array is updated
        ↓
Save data to LocalStorage
        ↓
Calculate income / expense / balance
        ↓
Render transaction history
        ↓
Update the UI
```

---

## 🔄 Application Initialization

When the page loads, the `initApp()` function runs.

It checks LocalStorage for previously saved transactions.

```javascript
const storedData = localStorage.getItem('transactions');
```

If data exists, it is converted back into a JavaScript array:

```javascript
transaction = JSON.parse(storedData);
```

Then the application:

```text
Calculates the summary
        ↓
Renders the transaction history
```

This allows previously saved transactions to appear automatically after refreshing the page.

---

## 📈 Monthly Analysis Flow

The Analysis feature follows this process:

```text
Get all transactions
        ↓
Filter only expenses
        ↓
Extract YYYY-MM from date
        ↓
Group expenses by month
        ↓
Calculate monthly totals
        ↓
Sort months from newest to oldest
        ↓
Display monthly expense summary
```

---

## 🎨 User Interface

The application contains:

```text
                 Expense Tracker

        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │  Balance   │ │   Income   │ │  Expense   │
        └────────────┘ └────────────┘ └────────────┘

        ┌─────────────────┐ ┌─────────────────┐
        │   Add Income    │ │   Add Expense   │
        └─────────────────┘ └─────────────────┘

                Transaction History

        ┌───────────────────────────────────────┐
        │ Food • 2026-10-06       -₹250.00      │
        │                         Edit | Delete  │
        └───────────────────────────────────────┘
```

---

## ▶️ How to Run the Project

No package installation or backend server is required.

### Method 1 — Open Directly

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a web browser.

### Method 2 — VS Code

1. Open the project in VS Code.
2. Open `index.html`.
3. Use the **Live Server** extension if installed.
4. Open the generated local URL in your browser.

---

## 📥 Clone the Repository

```bash
git clone https://github.com/noorvm/expense-tracker-Noor-Mohammed.git
```

Then enter the project directory:

```bash
cd expense-tracker-Noor-Mohammed
```

Open `index.html` in a browser or run it using Live Server.

---

## 🔐 Data Storage

This project does **not** use:

* MySQL
* PostgreSQL
* MongoDB
* Firebase
* Backend APIs
* User accounts

Instead, it uses:

```text
Browser LocalStorage
```

Therefore, transaction data is stored locally in the browser.

Clearing the browser's LocalStorage/site data can remove the saved transactions.

---

## ⚡ No Dependencies

This project does not require:

```text
npm install
package.json
Node.js
React
Backend server
Database
```

It is built using native web technologies:

```text
HTML
CSS
JavaScript
```

---

## 🧪 Concepts Practiced

This project demonstrates practical usage of several frontend development concepts:

* HTML semantic structure
* Forms
* Input handling
* Select/dropdown elements
* DOM manipulation
* JavaScript objects
* JavaScript arrays
* Array methods
* `forEach()`
* `filter()`
* `find()`
* Event listeners
* Form submission
* Template literals
* Conditional logic
* Functions
* LocalStorage
* JSON serialization
* JSON parsing
* Dynamic HTML rendering
* Modal interfaces
* Basic data analysis
* Responsive CSS
* CSS Grid
* CSS Flexbox

---

## 🔮 Possible Future Improvements

The project can be extended with:

* Search transactions
* Filter by category
* Filter by date
* Sort transactions
* Export transactions to CSV
* Import transactions from CSV
* Expense charts
* Category-wise expense analysis
* Budget limits
* Budget alerts
* Dark mode
* User authentication
* Cloud database
* Backend API
* Multi-device synchronization

---

## 👨‍💻 Author

**Noor Mohammed**

GitHub: [@noorvm](https://github.com/noorvm)

---

## 📄 License

This project is created for learning and demonstration purposes.
