let totalIncome = 0; // Tracks total income
let incomeSources = []; // Stores all income sources

// Function to fetch total income from the backend
function fetchTotalIncome() {
    fetch("http://localhost:8080/budget/total-income", {
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


// Function to fetch all income sources from the backend

function fetchIncomeSources() {
    fetch("http://localhost:8080/budget/income-sources", {
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
            incomeSources = data;
            const incomeList = document.getElementById("income-list");
            incomeList.innerHTML = ""; // Clear the list

            incomeSources.forEach((source) => {
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


// Function to add income
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

    // Send the income data to the backend
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

            // Clear input fields
            incomeNameInput.value = "";
            incomeAmountInput.value = "";

            // Hide input fields and reset buttons
            document.getElementById("input-fields-container").classList.add("hidden");
            document.getElementById("save-income-btn").classList.add("hidden");
            document.getElementById("add-item-btn").classList.remove("hidden");
        })
        .catch((error) => {
            alert("Error adding income: " + error.message);
            console.error("Error:", error);
        });
}


// function to remove income
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

            // Remove the income item from the UI
            const incomeItem = button.parentElement;
            incomeItem.remove();

            // Refresh total income and income list
            fetchTotalIncome();
        })
        .catch((error) => {
            alert("Error removing income: " + error.message);
            console.error("Error:", error);
        });
}


// Function to toggle input fields visibility
function toggleInputFields() {
    document.getElementById("input-fields-container").classList.remove("hidden");
    document.getElementById("save-income-btn").classList.remove("hidden");
    document.getElementById("add-item-btn").classList.add("hidden");
}

// Initialize the page by fetching data
function initializePage() {
    fetchTotalIncome();
    fetchIncomeSources();
    fetchEssentialExpenses();
}

// Event listener for page load
document.addEventListener("DOMContentLoaded", initializePage);

// Logout button functionality
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            alert("Logged out!");
            window.location.href = "/User_login/login.html"; // Adjust redirection path if needed
        });
    }
});

function showPlaceholder(type) {
    document.getElementById(`${type}-placeholder`).style.display = 'block';
}

// Fetch all essential expenses
function fetchEssentialExpenses() {
    fetch("http://localhost:8080/budget/essential-expenses", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            const expenseList = document.getElementById("bills-list");
            const totalElement = document.getElementById("bills-total");
            expenseList.innerHTML = ""; // Clear the list

            let totalAmount = 0;

            data.forEach((expense, index) => {
                totalAmount += expense.amount; // Add each expense's amount to the total

                const expenseItem = document.createElement("li");
                expenseItem.innerHTML = `
                    ${expense.name} - $${expense.amount.toFixed(2)}
                    <button onclick="deleteEssentialExpense(${index})" class="remove-btn">Remove</button>
                `;
                expenseList.appendChild(expenseItem);
            });

            // Update the total in the HTML
            totalElement.textContent = totalAmount.toFixed(2);
        })
        .catch((error) => console.error("Error fetching essential expenses:", error));
}


// Add an essential expense
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
            document.getElementById("bills-placeholder").style.display = 'none'; // Hide placeholder after adding
            document.getElementById("bills-item").value = ""; // Clear the input field
            document.getElementById("bills-amount").value = ""; // Clear the input field
        })

        .catch((error) => console.error("Error adding essential expense:", error));
}

// Delete an essential expense
function deleteEssentialExpense(index) {
    fetch(`http://localhost:8080/budget/essential-expenses/${index}`, {
        method: "DELETE",
    })
        .then(() => {
            fetchEssentialExpenses();
        })
        .catch((error) => console.error("Error deleting essential expense:", error));
}


// Fetch all optional spending
function fetchOptionalSpending() {
    fetch("http://localhost:8080/budget/optional-spending", {
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
            const spendingList = document.getElementById("fun-list");
            spendingList.innerHTML = ""; // Clear the list

            data.forEach((spending, index) => {
                if (spending) {
                    const spendingItem = document.createElement("li");
                    spendingItem.innerHTML = `
                        ${spending.name} - $${spending.amount.toFixed(2)}
                    `;
                    spendingList.appendChild(spendingItem);
                }
            });
        })
        .catch((error) => console.error("Error fetching optional spending:", error));
}

// Add an optional spending item
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
        })
        .catch((error) => console.error("Error adding optional spending:", error));
}

// Remove the last optional spending item (stack behavior)
function removeLastOptionalSpending() {
    fetch("http://localhost:8080/budget/optional-spending", {
        method: "DELETE",
    })
        .then(() => {
            fetchOptionalSpending();
        })
        .catch((error) => console.error("Error removing last optional spending item:", error));
}

