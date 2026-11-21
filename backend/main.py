
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import sqlite3
import uuid

app = FastAPI()

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------- DATABASE CONNECTION ----------------

def get_db():
    conn = sqlite3.connect("expenses.db")
    conn.row_factory = sqlite3.Row
    return conn


# Create database table
def create_table():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


create_table()


# ---------------- DATA VALIDATION ----------------

class Transaction(BaseModel):
    type: Literal["income", "expense"]
    description: str
    amount: float
    date: str
    category: str


# ---------------- HOME ROUTE ----------------

@app.get("/")
def home():
    return {"message": "Successfully connected to FastAPI"}


# ---------------- GET ALL TRANSACTIONS ----------------

@app.get("/transactions")
def get_transactions():

    conn = get_db()

    cursor = conn.execute(
        "SELECT * FROM transactions ORDER BY date DESC"
    )

    transactions = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return transactions


# ---------------- GET SINGLE TRANSACTION ----------------

@app.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: str):

    conn = get_db()

    cursor = conn.execute(
        "SELECT * FROM transactions WHERE id = ?",
        (transaction_id,)
    )

    transaction = cursor.fetchone()

    conn.close()

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return dict(transaction)


# ---------------- ADD TRANSACTION ----------------

@app.post("/transactions", status_code=201)
def add_transaction(item: Transaction):

    transaction_id = str(uuid.uuid4())

    conn = get_db()

    conn.execute("""
        INSERT INTO transactions
        (id, type, description, amount, date, category)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        transaction_id,
        item.type,
        item.description,
        item.amount,
        item.date,
        item.category
    ))

    conn.commit()
    conn.close()

    return {
        "message": "Transaction added successfully",
        "id": transaction_id
    }


# ---------------- UPDATE TRANSACTION ----------------

@app.put("/transactions/{transaction_id}")
def update_transaction(
    transaction_id: str,
    item: Transaction
):

    conn = get_db()

    cursor = conn.execute("""
        UPDATE transactions
        SET type = ?,
            description = ?,
            amount = ?,
            date = ?,
            category = ?
        WHERE id = ?
    """, (
        item.type,
        item.description,
        item.amount,
        item.date,
        item.category,
        transaction_id
    ))

    conn.commit()
    updated = cursor.rowcount
    conn.close()

    if updated == 0:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return {"message": "Transaction updated successfully"}


# ---------------- DELETE TRANSACTION ----------------

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: str):

    conn = get_db()

    cursor = conn.execute(
        "DELETE FROM transactions WHERE id = ?",
        (transaction_id,)
    )

    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return {"message": "Transaction deleted successfully"}


# ---------------- FINANCIAL SUMMARY ----------------

@app.get("/summary")
def get_summary():

    conn = get_db()

    cursor = conn.execute("""
        SELECT
            COALESCE(SUM(CASE
                WHEN type = 'income' THEN amount
                ELSE 0 END), 0) AS income,

            COALESCE(SUM(CASE
                WHEN type = 'expense' THEN amount
                ELSE 0 END), 0) AS expense

        FROM transactions
    """)

    result = cursor.fetchone()

    conn.close()

    income = result["income"]
    expense = result["expense"]

    return {
        "income": income,
        "expense": expense,
        "balance": income - expense
    }


# ---------------- MONTHLY EXPENSE SUMMARY ----------------

@app.get("/summary/monthly")
def monthly_summary():

    conn = get_db()

    cursor = conn.execute("""
        SELECT
            SUBSTR(date, 1, 7) AS month,
            SUM(amount) AS total
        FROM transactions
        WHERE type = 'expense'
        GROUP BY SUBSTR(date, 1, 7)
        ORDER BY month DESC
    """)

    result = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return result
