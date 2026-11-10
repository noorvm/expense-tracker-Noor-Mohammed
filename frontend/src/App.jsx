
import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const CATEGORIES = {
    income: ['Salary', 'Investments', 'Other'],
    expense: ['Food', 'Transportation', 'Rent & Bills', 'Other']
  }

  const [transactions, setTransactions] = useState(() => {
    const storedData = localStorage.getItem('transactions')
    return storedData ? JSON.parse(storedData) : []
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [transactionType, setTransactionType] = useState('expense')
  const [editId, setEditId] = useState('')

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Food'
  })

  // Save transactions to LocalStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  // Calculate Summary
  const income = transactions
    .filter(item => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0)

  const expense = transactions
    .filter(item => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0)

  const balance = income - expense

  // Open Modal
  function openModal(type) {
    setTransactionType(type)
    setEditId('')

    setFormData({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: CATEGORIES[type][0]
    })

    setModalOpen(true)
  }

  // Close Modal
  function closeModal() {
    setModalOpen(false)
  }

  // Handle Input Changes
  function handleChange(e) {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add or Edit Transaction
  function handleSubmit(e) {
    e.preventDefault()

    const itemData = {
      id: editId || Date.now().toString(),
      type: transactionType,
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category
    }

    if (editId) {
      setTransactions(prev =>
        prev.map(item =>
          item.id === editId ? itemData : item
        )
      )
    } else {
      setTransactions(prev => [itemData, ...prev])
    }

    closeModal()
  }

  // Delete Transaction
  function deleteTransaction(id) {
    setTransactions(prev =>
      prev.filter(item => item.id !== id)
    )
  }

  // Edit Transaction
  function editTransaction(id) {
    const item = transactions.find(t => t.id === id)

    if (!item) return

    setTransactionType(item.type)
    setEditId(item.id)

    setFormData({
      description: item.description,
      amount: item.amount,
      date: item.date,
      category: item.category
    })

    setModalOpen(true)
  }

  // Monthly Expense Summary
  const monthlyTotals = {}

  transactions
    .filter(item => item.type === 'expense')
    .forEach(item => {
      const monthKey = item.date.slice(0, 7)

      monthlyTotals[monthKey] =
        (monthlyTotals[monthKey] || 0) + item.amount
    })

  const sortedMonths = Object.keys(monthlyTotals).sort().reverse()

  return (
    <>

      <h1>Expense Tracker</h1>

      {/* Summary Section */}

      <section>
        <div>
          <h2>Current Balance</h2>
          <p id="total-balance">₹{balance.toFixed(2)}</p>
        </div>

        <div>
          <h2>Total Income</h2>
          <p id="total-income">₹{income.toFixed(2)}</p>
        </div>

        <div>
          <h2>Total Expense</h2>
          <p id="total-expense">₹{expense.toFixed(2)}</p>
        </div>
      </section>

      {/* Add Transaction Buttons */}

      <section>
        <button onClick={() => openModal('income')}>
          Add Income
        </button>

        <button onClick={() => openModal('expense')}>
          Add Expense
        </button>

        {/* Transaction Modal */}

        <div
          id="modal-container"
          className={`modal ${modalOpen ? '' : 'hidden'}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="modal-content">

            <button type="button" id="btn-close-modal" onClick={closeModal}>
              X Close
            </button>

            <br />

            <h2 id="modal-heading">
              {editId
                ? 'Edit Transaction'
                : transactionType === 'income'
                  ? 'Add Income'
                  : 'Add Expense'}
            </h2>

            <form id="transaction-form" onSubmit={handleSubmit}>

              <input
                type="hidden"
                id="edit-id"
                value={editId}
                readOnly
              />

              <input
                type="hidden"
                id="transaction-type"
                value={transactionType}
                readOnly
              />

              <label>Description</label>

              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter the purpose"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <label>Amount</label>

              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
              />

              <label>Date</label>

              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <label>Category</label>

              <select
                id={transactionType === 'expense'
                  ? 'expense-category'
                  : 'income-category'}
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES[transactionType].map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button type="submit" id="submit-btn">
                Save
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* Transaction History */}

      <section>
        <h2>
          Transaction History

          <button
            id="analysis-btn"
            onClick={() => setAnalysisOpen(true)}
          >
            Analysis
          </button>
        </h2>

        <ul id="transaction-list">

          {transactions.length === 0 ? (

            <p style={{
              color: '#64748b',
              textAlign: 'center',
              marginTop: '10px'
            }}>
              No transactions added yet.
            </p>

          ) : (

            transactions.map(item => (

              <li
                key={item.id}
                className={`transaction-item ${item.type}`}
              >

                <div>
                  <strong>{item.description}</strong>

                  <p style={{
                    fontSize: '0.8rem',
                    color: '#64748b'
                  }}>
                    {item.category} • {item.date}
                  </p>
                </div>

                <div>

                  <span style={{
                    fontWeight: 700,
                    marginRight: '12px'
                  }}>
                    {item.type === 'income' ? '+' : '-'}
                    ₹{item.amount.toFixed(2)}
                  </span>

                  <button
                    onClick={() => editTransaction(item.id)}
                    style={{
                      background: 'none',
                      color: '#4f46e5',
                      fontSize: '0.85rem',
                      padding: '4px'
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTransaction(item.id)}
                    style={{
                      background: 'none',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      padding: '4px'
                    }}
                  >
                    Delete
                  </button>

                </div>

              </li>

            ))

          )}

        </ul>
      </section>

      {/* Analysis Modal */}

      <div
        id="analysis-modal-container"
        className={`modal ${analysisOpen ? '' : 'hidden'}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setAnalysisOpen(false)
          }
        }}
      >

        <div className="modal-content">

          <button
            type="button"
            id="btn-close-analysis"
            onClick={() => setAnalysisOpen(false)}
          >
            ✕ Close
          </button>

          <h2>Monthly Expense Summary</h2>

          <div style={{ marginTop: '16px' }}>

            <ul
              id="monthly-list"
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >

              {sortedMonths.length === 0 ? (

                <li style={{
                  color: '#64748b',
                  textAlign: 'center'
                }}>
                  No expense history available.
                </li>

              ) : (

                sortedMonths.map(monthKey => {

                  const [year, month] = monthKey.split('-')

                  const dateObj = new Date(year, month - 1)

                  const monthName = dateObj.toLocaleString(
                    'default',
                    {
                      month: 'long',
                      year: 'numeric'
                    }
                  )

                  return (

                    <li
                      key={monthKey}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0'
                      }}
                    >

                      <span style={{ fontWeight: 500 }}>
                        {monthName}
                      </span>

                      <span style={{
                        fontWeight: 700,
                        color: '#ef4444'
                      }}>
                        -₹{monthlyTotals[monthKey].toFixed(2)}
                      </span>

                    </li>

                  )

                })

              )}

            </ul>

          </div>

        </div>

      </div>

    </>
  )
}

export default App
