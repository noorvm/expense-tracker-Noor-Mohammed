import './summary.css'


function Summary({balance, income, expense}){

    return(
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
    );
}

export default Summary;