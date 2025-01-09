let totalIncome = 0; 
let incomeSources = []; 

function fetchTotalIncome() {
    fetch("http://localhost:8080/budget/current-month-total-income", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch total income.");
        }
        return response.json();
    })
    .then((data) => {
        totalIncome = data;
        document.getElementById("total-income-result").textContent = `Total Income: $${totalIncome.toFixed(2)}`;
        document.getElementById("headerTotalAssets").textContent = `$${totalIncome.toFixed(2)}`;
    })
    .catch((error) => {
        console.error("Error fetching total income:", error);
    });
}


function fetchIncomeSources() {
    fetch("http://localhost:8080/budget/current-month-income-sources", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch income sources.");
        }
        return response.json();
    })
    .then((data) => {
        const incomeList = document.getElementById("income-list");
        incomeList.innerHTML = ""; 

        data.forEach((source) => {
            const incomeItem = document.createElement("div");
            incomeItem.className = "income-item";
            incomeItem.innerHTML = `
                <span>${source.sourceName}</span>
                <span>$${source.amount.toFixed(2)}</span>
                <button class="remove-btn" onclick="removeIncome(${source.id}, this)">Remove</button>
            `;
            incomeList.appendChild(incomeItem);
        });
    })
    .catch((error) => {
        console.error("Error fetching income sources:", error);
    });
}


function addIncome() {
    const incomeNameInput = document.getElementById("income-name");
    const incomeAmountInput = document.getElementById("income-amount");

    const incomeName = incomeNameInput.value.trim();
    const incomeAmount = parseFloat(incomeAmountInput.value);

    if (!incomeName || isNaN(incomeAmount) || incomeAmount <= 0) {
        alert("Please enter a valid income source name and amount.");
        return;
    }

    const incomeData = {
        sourceName: incomeName,
        amount: incomeAmount,
    };

    fetch("http://localhost:8080/budget/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(incomeData),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to add income.");
        }
        return response.json();
    })
    .then((data) => {
        alert("Income added successfully!");
        fetchTotalIncome();
        fetchIncomeSources();

        incomeNameInput.value = "";
        incomeAmountInput.value = "";

        document.getElementById("input-fields-container").classList.add("hidden");
        document.getElementById("save-income-btn").classList.add("hidden");
        document.getElementById("add-item-btn").classList.remove("hidden");
    })
    .catch((error) => {
        alert("Error adding income: " + error.message);
        console.error("Error:", error);
    });
}


function removeIncome(id, button) {
    fetch(`http://localhost:8080/budget/remove/${id}`, {
        method: "DELETE",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to remove income.");
        }
        return response.text();
    })
    .then((message) => {
        alert(message);

        const incomeItem = button.parentElement;
        incomeItem.remove();

        fetchTotalIncome();
    })
    .catch((error) => {
        alert("Error removing income: " + error.message);
        console.error("Error:", error);
    });
}


function toggleInputFields() {
    document.getElementById("input-fields-container").classList.remove("hidden");
    document.getElementById("save-income-btn").classList.remove("hidden");
    document.getElementById("add-item-btn").classList.add("hidden");
}

function initializePage() {
    fetchTotalIncome();
    fetchIncomeSources();
    fetchEssentialExpenses();
    fetchOptionalSpending();
    updateTotalBudget();
}

document.addEventListener("DOMContentLoaded", initializePage);

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            alert("Logged out!");
            window.location.href = "/User_login/login.html"; 
        });
    }
});


function showPlaceholder(type) {
    document.getElementById(`${type}-placeholder`).style.display = 'block';
}


// function fetchEssentialExpenses() {
//     fetch("http://localhost:8080/budget/essential-expenses", {
//         method: "GET",
//     })
//     .then((response) => response.json())
//     .then((data) => {
//         const expenseList = document.getElementById("bills-list");
//         const totalElement = document.getElementById("bills-total");
//         expenseList.innerHTML = ""; 

//         let totalAmount = 0;

//         data.forEach((expense) => {
//             totalAmount += expense.amount;

//             const expenseItem = document.createElement("li");
//             expenseItem.innerHTML = `
//                 ${expense.name} - $${expense.amount.toFixed(2)}
//                 <button onclick="deleteEssentialExpense(${expense.id})" class="remove-btn">Remove</button>
//             `;
//             expenseList.appendChild(expenseItem);
//         });

//         totalElement.textContent = totalAmount.toFixed(2);
//     })
//     .catch((error) => console.error("Error fetching essential expenses:", error));
// }
function fetchEssentialExpenses() {
    fetch("http://localhost:8080/budget/essential-expenses", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const expenseList = document.getElementById("bills-list");
        const totalElement = document.getElementById("bills-total");
        expenseList.innerHTML = ""; 

        let totalAmount = 0;

        data.forEach((expense) => {
            totalAmount += expense.amount;

            const expenseItem = document.createElement("li");
            expenseItem.classList.add("expense-item"); // Add the class for styling
            expenseItem.innerHTML = `
                <span>${expense.name} - $${expense.amount.toFixed(2)}</span>
                <div>
                    <button onclick="editEssentialExpense(${expense.id}, '${expense.name}', ${expense.amount})" class="edit-btn">Edit</button>
                    <button onclick="deleteEssentialExpense(${expense.id})" class="remove-btn">Remove</button>
                </div>
            `;
            expenseList.appendChild(expenseItem);
        });

        totalElement.textContent = totalAmount.toFixed(2);
    })
    .catch((error) => console.error("Error fetching essential expenses:", error));
}

function editEssentialExpense(id, currentName, currentAmount) {
    // Show the placeholder input fields
    const placeholder = document.getElementById("bills-placeholder");
    placeholder.style.display = "block";

    // Populate the input fields with current values
    const nameInput = document.getElementById("bills-item");
    const amountInput = document.getElementById("bills-amount");
    nameInput.value = currentName;
    amountInput.value = currentAmount;

    // Update the add button to act as an edit button
    const addButton = placeholder.querySelector("button");
    addButton.textContent = "Update";
    addButton.onclick = () => updateEssentialExpense(id);
}

function updateEssentialExpense(id) {
    const nameInput = document.getElementById("bills-item");
    const amountInput = document.getElementById("bills-amount");

    const updatedName = nameInput.value.trim();
    const updatedAmount = parseFloat(amountInput.value);

    if (!updatedName || isNaN(updatedAmount) || updatedAmount <= 0) {
        alert("Please enter a valid name and amount.");
        return;
    }

    const updatedExpense = { name: updatedName, amount: updatedAmount };

    fetch(`http://localhost:8080/budget/essential-expenses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedExpense),
    })
    .then(() => {
        fetchEssentialExpenses();
        updateTotalBudget();

        // Reset the input fields and button
        document.getElementById("bills-item").value = "";
        document.getElementById("bills-amount").value = "";
        const placeholder = document.getElementById("bills-placeholder");
        placeholder.style.display = "none";
    })
    .catch((error) => console.error("Error updating essential expense:", error));
}


function addEssentialExpense() {
    const itemName = document.getElementById("bills-item").value.trim();
    const itemAmount = parseFloat(document.getElementById("bills-amount").value);

    if (!itemName || isNaN(itemAmount) || itemAmount <= 0) {
        alert("Please enter a valid item name and amount.");
        return;
    }

    const expense = { name: itemName, amount: itemAmount };

    fetch("http://localhost:8080/budget/essential-expenses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
    })
    .then(() => {
        fetchEssentialExpenses();
        updateTotalBudget();
        document.getElementById("bills-placeholder").style.display = 'none'; 
        document.getElementById("bills-item").value = ""; 
        document.getElementById("bills-amount").value = ""; 
    })

    .catch((error) => console.error("Error adding essential expense:", error));
}


function deleteEssentialExpense(id) {
    fetch(`http://localhost:8080/budget/essential-expenses/${id}`, {
        method: "DELETE",
    })
    .then(() => {
        fetchEssentialExpenses();
        updateTotalBudget();
    })
    .catch((error) => console.error("Error deleting essential expense:", error));
}


function fetchOptionalSpending() {
    fetch("http://localhost:8080/budget/optional-spending", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const spendingList = document.getElementById("fun-list");
        const totalElement = document.getElementById("fun-total");
        spendingList.innerHTML = "";
        let totalAmount = 0;

        data.forEach((spending, index) => {
            if (spending) {
                totalAmount += spending.amount;

                const spendingItem = document.createElement("li");
                spendingItem.innerHTML = `
                    ${spending.name} - $${spending.amount.toFixed(2)}
                `;
                spendingList.appendChild(spendingItem);
            }
        });
        totalElement.textContent = totalAmount.toFixed(2);
    })
    .catch((error) => console.error("Error fetching optional spending:", error));
}


function addOptionalSpending() {
    const itemName = document.getElementById("fun-item").value.trim();
    const itemAmount = parseFloat(document.getElementById("fun-amount").value);

    if (!itemName || isNaN(itemAmount) || itemAmount <= 0) {
        alert("Please enter a valid item name and amount.");
        return;
    }

    const spendingItem = { name: itemName, amount: itemAmount };

    fetch("http://localhost:8080/budget/optional-spending", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spendingItem),
    })
    .then(() => {
        fetchOptionalSpending();
        updateTotalBudget();
        document.getElementById("fun-placeholder").style.display = 'none'; 
        document.getElementById("fun-item").value = ""; 
        document.getElementById("fun-amount").value = ""; 
    })
    .catch((error) => console.error("Error adding optional spending:", error));
}


function removeLastOptionalSpending() {
    fetch("http://localhost:8080/budget/optional-spending", {
        method: "DELETE",
    })
    .then(() => {
        fetchOptionalSpending();
        updateTotalBudget();
    })
    .catch((error) => console.error("Error removing last optional spending item:", error));
}


function updateTotalBudget() {
    Promise.all([
        fetch("http://localhost:8080/budget/essential-expenses", { method: "GET" }).then(response => response.json()),
        fetch("http://localhost:8080/budget/optional-spending", { method: "GET" }).then(response => response.json()),
    ])
    .then(([essentialExpenses, optionalSpending]) => {
        let totalEssential = essentialExpenses.reduce((total, expense) => total + expense.amount, 0);
        let totalOptional = optionalSpending.reduce((total, spending) => total + (spending ? spending.amount : 0), 0);

        const totalBudgetElement = document.getElementById("headerTotalDebts");
        totalBudgetElement.textContent = `$${(totalEssential + totalOptional).toFixed(2)}`;
    })
    .catch(error => console.error("Error updating total budget:", error));
}


document.addEventListener("DOMContentLoaded", () => {
const userImage = document.getElementById("userImage");
const dropdownMenu = document.getElementById("dropdownMenu");

userImage.addEventListener("click", (event) => {
    event.stopPropagation(); 
    dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", () => {
    dropdownMenu.style.display = "none";
});

const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", () => {
    alert("Logged out!");
    window.location.href = "/User_login/login.html"; 
});
});
  
  