// local storage
let users = JSON.parse(localStorage.getItem('users')) || [];


// signUp form submission
let signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
    signUpForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let existingUser = users.find(u => u.email === signUpEmail.value);
        if (existingUser) {
            alert('Email already registered!');
            return;
        }
        let newUser = {
            email: signUpEmail.value,
            password: signUpPassword.value
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! Please login.');
        window.location.href = 'login.html';

    });
}

// login form submission
let loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let email = loginEmail.value;
        let password = loginPassword.value;
        let user = users.find(user => user.email === email && user.password === password);
        if (user) {
            alert('Login successful!');
            window.location.href = '../index.html';
        } else {
            alert('Invalid email or password');
        }

    });
}


// / dark & light mode
const themeLabel = document.getElementById("themeLabel");
const darkModeToggle = document.getElementById("darkModeToggle");

// / /Load saved preference
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    if (darkModeToggle) darkModeToggle.checked = false;
}

//  / Toggle on switch click
if (darkModeToggle) {
    darkModeToggle.addEventListener("change", (e) => {

        if (!e.target.checked) {
            document.body.classList.add("light-mode");
            if (themeLabel) themeLabel.textContent = "Light Mode";
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-mode");
            if (themeLabel) themeLabel.textContent = "Dark Mode";
            localStorage.setItem("theme", "dark");
        }
    });
}


// add tranaction  open and close
let closeModalBtn = document.getElementById('closeModalBtn')
let addBtn = document.getElementById('addTransactionBtn');
let modal = document.getElementById('transactionModal');

if (addBtn) {
    addBtn.addEventListener('click', function () {
        modal.classList.remove('hidden');
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function () {
        modal.classList.add('hidden');
    });
}


// adding transaction to local storage
let transactionForm = document.getElementById('transactionForm');

if (transactionForm) {
    transactionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        let newTransaction = {
            id: Date.now(),
            type: document.getElementById('transactionType').value,
            description: document.getElementById('transactionDescription').value,
            amount: Number(document.getElementById('transactionAmount').value),  // Number() zaroori hai, warna string save hogi
            date: document.getElementById('transactionDate').value,
            category: document.getElementById('transactionCategory').value
        };

        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        modal.classList.add('hidden');
        transactionForm.reset();

        console.log('Transaction saved:', newTransaction);
    });
}


// show transition 
function renderTransactions() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let tbody = document.getElementById('transactionsTableBody');

    if (!tbody) return;

    tbody.innerHTML = '';

    transactions.forEach(function (t) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td class="${t.type === 'income' ? 'text-green' : 'text-red'}">
                ${t.type === 'income' ? '+' : '-'}₹${t.amount}
            </td>
            <td><button onclick="deleteTransaction(${t.id})">🗑</button></td>
        `;
        tbody.appendChild(row);
    });
}

function updateDashboard() {
    let balanceEl = document.getElementById('currentBalance');
    if (!balanceEl) return;

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    let totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    let totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    let currentBalance = totalIncome - totalExpense;
    let totalTransactions = transactions.length;

    document.getElementById('totalIncome').textContent = '$' + totalIncome.toFixed(2);
    document.getElementById('totalExpense').textContent = '$' + totalExpense.toFixed(2);
    balanceEl.textContent = '$' + currentBalance.toFixed(2);
    document.getElementById('totalTransactions').textContent = totalTransactions;
}




let chartInstance = null;

function renderChart() {
    let canvas = document.getElementById('cashFlowChart');
    if (!canvas) return;

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    let totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    let totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Income vs Expenses'],   // x-axis pe sirf ek hi label
            datasets: [
                {
                    label: 'Income',
                    data: [totalIncome],       // array me ek hi value
                    backgroundColor: '#16a34a'
                },
                {
                    label: 'Expenses',
                    data: [totalExpense],
                    backgroundColor: '#dc2626'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

let resetDataBtn = document.getElementById('resetDataBtn');
if (resetDataBtn) {
    resetDataBtn.addEventListener('click', function () {
        let sure = confirm('kya sach me data reset karna hai...');
        if (sure) {
            localStorage.removeItem('transactions');
            renderChart();
            renderTransactions();
            updateDashboard();
        }
    });
}

renderChart()
renderTransactions();
updateDashboard();

