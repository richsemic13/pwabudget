document.addEventListener("DOMContentLoaded", () => {

    let currentUser = localStorage.getItem("currentUser");

    // ===== PROTECT PAGE =====
    if (!currentUser && window.location.pathname.includes("dashboard")) {
        window.location.href = "index.html";
        return;
    }

    // ===== GET USERS =====
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userData = users.find(u => u.email === currentUser);

    // ===== SHOW USERNAME + AVATAR =====
    if (userData) {
        let nameEl = document.getElementById("usernameDisplay");

        if (nameEl) nameEl.textContent = userData.username;
    }

    // ===== USER DATA =====
    let budgetData = JSON.parse(localStorage.getItem(currentUser + "_budget")) || {
        totalBudget: 0,
        totalExpenses: 0,
        budgetLeft: 0,
        expenses: []
    };

    let expenseChart;

    function formatCurrency(val) {
        return "₱" + val.toFixed(2);
    }

    function save() {
        localStorage.setItem(currentUser + "_budget", JSON.stringify(budgetData));
    }

    function updateUI() {
        if (!document.getElementById("totalBudget")) return;

        document.getElementById("totalBudget").textContent = formatCurrency(budgetData.totalBudget);
        document.getElementById("totalExpenses").textContent = formatCurrency(budgetData.totalExpenses);
        document.getElementById("budgetLeft").textContent = formatCurrency(budgetData.budgetLeft);

        let tbody = document.querySelector("tbody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (budgetData.expenses.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No expenses yet.</td></tr>`;
            return;
        }

        budgetData.expenses.forEach(e => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${e.title}</td>
                <td>${formatCurrency(e.amount)}</td>
                <td>${e.category}</td>
                <td>${e.date}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteExpense(${e.id})">Delete</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        updateChart();
    }

    // ===== DELETE =====
    window.deleteExpense = function (id) {
        let exp = budgetData.expenses.find(e => e.id == id);
        if (!exp) return;

        budgetData.totalExpenses -= exp.amount;
        budgetData.budgetLeft += exp.amount;
        budgetData.expenses = budgetData.expenses.filter(e => e.id != id);

        save();
        updateUI();
    };

    // ===== CHART =====
    function updateChart() {
        let chartDiv = document.getElementById("chartContainer");
        let canvas = document.getElementById("expenseChart");

        if (!chartDiv || !canvas || chartDiv.style.display === "none") return;

        let data = {};
        budgetData.expenses.forEach(e => {
            data[e.category] = (data[e.category] || 0) + e.amount;
        });

        let ctx = canvas.getContext("2d");

        if (expenseChart) expenseChart.destroy();

        expenseChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: Object.keys(data).map(() =>
                        '#' + Math.floor(Math.random()*16777215).toString(16)
                    )
                }]
            }
        });
    }

    // ===== ADD BUDGET =====
    document.querySelector(".add-budget-container form")?.addEventListener("submit", e => {
        e.preventDefault();

        let val = parseFloat(document.getElementById("budget").value);
        if (isNaN(val) || val <= 0) return alert("Invalid");

        budgetData.totalBudget += val;
        budgetData.budgetLeft += val;

        save();
        updateUI();
        e.target.reset();
    });

    // ===== ADD EXPENSE =====
    document.querySelector(".add-expense-container form")?.addEventListener("submit", e => {
        e.preventDefault();

        let title = document.getElementById("expense").value.trim();
        let amount = parseFloat(document.getElementById("amount").value);
        let category = document.getElementById("category").value;

        if (!title || isNaN(amount) || amount <= 0) return alert("Invalid");
        if (amount > budgetData.budgetLeft) return alert("Not enough budget");

        budgetData.expenses.push({
            id: Date.now(),
            title,
            amount,
            category,
            date: new Date().toLocaleDateString()
        });

        budgetData.totalExpenses += amount;
        budgetData.budgetLeft -= amount;

        save();
        updateUI();
        e.target.reset();
    });

    // ===== TOGGLE CHART =====
    document.getElementById("toggleChartBtn")?.addEventListener("click", () => {
        let chart = document.getElementById("chartContainer");

        chart.style.display = chart.style.display === "none" ? "block" : "none";

        updateChart();
    });

    updateUI();
});