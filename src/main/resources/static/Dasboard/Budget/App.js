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
