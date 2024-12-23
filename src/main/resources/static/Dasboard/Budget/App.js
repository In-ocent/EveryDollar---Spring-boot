function showPlaceholder(type) {
    const placeholder = document.getElementById(`${type}-placeholder`);
    placeholder.style.display = 'block';
}

function addItem(type) {
    const itemInput = document.getElementById(`${type}-item`);
    const amountInput = document.getElementById(`${type}-amount`);
    const list = document.getElementById(`${type}-list`);

    const itemName = itemInput.value.trim();
    const itemAmount = amountInput.value.trim();

    if (itemName && itemAmount) {
        const li = document.createElement('li');
        li.innerHTML = `${itemName} <span>$${parseFloat(itemAmount).toFixed(2)}</span>`;
        list.appendChild(li);

        // Clear input fields
        itemInput.value = '';
        amountInput.value = '';

        // Hide the placeholder
        document.getElementById(`${type}-placeholder`).style.display = 'none';
    } else {
        alert('Please enter both name and amount.');
    }
}

// let isSalaryAdded = false;

//         function handleSalary() {
//             const input = document.getElementById("monthly-salary");
//             const result = document.getElementById("salary-result");
//             const container = document.getElementById("salary-container");
//             const button = document.getElementById("action-button");
//             const salary = input.value.trim();

//             if (!isSalaryAdded) {
//                 // Add Salary
//                 if (salary) {
//                     result.innerHTML = `Your salary is &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br><span style="font-size: 24px;">$${salary}</span>`;
//                     input.style.display = "none"; // Hide input
//                     button.textContent = "Update Salary"; // Change button text
//                     container.removeChild(input.previousElementSibling); // Remove label
//                     isSalaryAdded = true;
//                 } else {
//                     result.textContent = "Please enter a valid salary.";
//                 }
//             } else {
//                 // Update Salary
//                 result.textContent = "";
//                 const label = document.createElement("label");
//                 label.textContent = "Update Monthly Salary:";
//                 label.htmlFor = "monthly-salary";

//                 // Re-add input and label
//                 input.style.display = "block";
//                 input.placeholder = "Update your monthly salary";
//                 container.insertBefore(label, input);
//                 button.textContent = "Add Salary"; // Reset button text
//                 isSalaryAdded = false;
//             }
//         }

let incomeSources = [];
let totalIncomes = 0;

function addIncome() {
    const incomeName = document.getElementById("income-name").value.trim();
    const incomeAmount = parseFloat(document.getElementById("income-amount").value);

    if (incomeName === "" || isNaN(incomeAmount) || incomeAmount <= 0) {
        alert("Please provide valid income source name and amount.");
        return;
    }

    // Add the new income source to the list
    incomeSources.push({ name: incomeName, amount: incomeAmount });

    // Update the total income
    totalIncomes += incomeAmount;

    // Update the UI
    updateIncomeUI();

    // Clear input fields
    document.getElementById("income-name").value = "";
    document.getElementById("income-amount").value = "";
}

function updateIncomeUI() {
    // Update the total income display
    document.getElementById("total-income-result").innerText = `Total Income: ${totalIncome}`;

    // Update the income list display
    const incomeListDiv = document.getElementById("income-list");
    incomeListDiv.innerHTML = ""; // Clear previous list

    incomeSources.forEach((source, index) => {
        const incomeItem = document.createElement("div");
        incomeItem.className = "income-item";

        incomeItem.innerHTML = `
            <p>${source.name}: ${source.amount}</p>
            <button onclick="removeIncome(${index})">Remove</button>
        `;

        incomeListDiv.appendChild(incomeItem);
    });
}

function removeIncome(index) {
    // Subtract the income amount from total income
    totalIncomes -= incomeSources[index].amount;

    // Remove the income source from the list
    incomeSources.splice(index, 1);

    // Update the UI
    updateIncomeUI();
}

function showPlaceholder(type) {
        document.getElementById(type + '-placeholder').style.display = 'block';
    }

    function addItem(type) {
        const itemInput = document.getElementById(type + '-item');
        const amountInput = document.getElementById(type + '-amount');
        
        const itemName = itemInput.value.trim();
        const itemAmount = parseFloat(amountInput.value);

        if (itemName && !isNaN(itemAmount)) {
            // Add item to the respective list
            const list = document.getElementById(type + '-list');
            const listItem = document.createElement('li');
            listItem.textContent = `${itemName}: $${itemAmount.toFixed(2)}`;
            list.appendChild(listItem);
            
            // Add item amount to the total
            updateTotalAmount(type, itemAmount);

            // Clear the inputs
            itemInput.value = '';
            amountInput.value = '';

            // Hide the placeholder
            document.getElementById(type + '-placeholder').style.display = 'none';
        } else {
            alert('Please enter a valid item name and amount.');
        }
    }

    function updateTotalAmount(type, amount) {
        const totalElement = document.getElementById(type + '-total');
        let totalAmount = parseFloat(totalElement.textContent) || 0;
        totalAmount += amount;
        totalElement.textContent = totalAmount.toFixed(2);
        updateOverallTotal();
    }

    function updateOverallTotal() {
        const essentialTotal = parseFloat(document.getElementById('bills-total').textContent) || 0;
        const optionalTotal = parseFloat(document.getElementById('fun-total').textContent) || 0;
        const overallTotal = essentialTotal + optionalTotal;
        document.getElementById('headerTotalDebts').textContent = overallTotal.toFixed(2);
    }

const incomeList = document.getElementById("income-list");
        const totalIncomeResult = document.getElementById("total-income-result");
        const inputFieldsContainer = document.getElementById("input-fields-container");
        const addItemBtn = document.getElementById("add-item-btn");
        const saveIncomeBtn = document.getElementById("save-income-btn");

        let totalIncome = 0;
        let totalBudget = 0;  // Track total budget for expenses

        function toggleInputFields() {
            inputFieldsContainer.classList.remove("hidden");
            saveIncomeBtn.classList.remove("hidden");
            addItemBtn.classList.add("hidden");
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

            // Create income item
            const incomeItem = document.createElement("div");
            incomeItem.className = "income-item";

            incomeItem.innerHTML = `
                <span>${incomeName}</span>
                <span>$${incomeAmount.toFixed(2)}</span>
                <button class="remove-btn" onclick="removeIncome(this, ${incomeAmount})">Remove</button>
            `;

            incomeList.appendChild(incomeItem);

            // Update total income
            totalIncome += incomeAmount;
            totalIncomeResult.textContent = `Total Income: $${totalIncome.toFixed(2)}`;

            // Update the Total Income header
            document.getElementById("headerTotalAssets").textContent = `$${totalIncome.toFixed(2)}`;

            // Reset input fields and hide input fields
            incomeNameInput.value = "";
            incomeAmountInput.value = "";
            inputFieldsContainer.classList.add("hidden");
            saveIncomeBtn.classList.add("hidden");
            addItemBtn.classList.remove("hidden");
        }

        function removeIncome(button, incomeAmount) {
            const incomeItem = button.parentElement;
            incomeList.removeChild(incomeItem);

            // Update total income
            totalIncome -= incomeAmount;
            totalIncomeResult.textContent = `Total Income: $${totalIncome.toFixed(2)}`;

            // Update the Total Income header
            document.getElementById("headerTotalAssets").textContent = `$${totalIncome.toFixed(2)}`;
            document.getElementById('headerTotalDebts').textContent = `$${totalIncome.toFixed(2)}`;
        }

        // Function to add and delete budget items (expenses)
        function addExpense() {
            // This will add an expense item similar to how income is added
        }

        function removeExpense(button, expenseAmount) {
            // This will remove an expense item and update the total budget
        }

        // Update header divs for real-time display of totals
        document.getElementById('total-income-result').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('headerTotalDebts').textContent = `$${totalIncome.toFixed(2)}`;

        function showPlaceholder(type) {
            document.getElementById(`${type}-placeholder`).style.display = 'block';
        }
    
        function addItem(type) {
            const itemInput = document.getElementById(`${type}-item`);
            const amountInput = document.getElementById(`${type}-amount`);
            const list = document.getElementById(`${type}-list`);
            const totalSpan = document.getElementById(`${type}-total`);
    
            const itemName = itemInput.value.trim();
            const itemAmount = parseFloat(amountInput.value);
    
            if (itemName && !isNaN(itemAmount) && itemAmount > 0) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${itemName}: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$${itemAmount.toFixed(2)} 
                    <button onclick="deleteItem(this, '${type}', ${itemAmount})">Delete</button>`;
                list.appendChild(listItem);
    
                // Update total
                const currentTotal = parseFloat(totalSpan.textContent);
                totalSpan.textContent = (currentTotal + itemAmount).toFixed(2);
    
                // Clear inputs
                itemInput.value = '';
                amountInput.value = '';
            } else {
                alert('Please enter valid item name and amount.');
            }
        }
    
        function deleteItem(button, type, itemAmount) {
            const totalSpan = document.getElementById(`${type}-total`);
    
            // Remove the list item
            const listItem = button.parentElement;
            listItem.remove();
    
            // Update total
            const currentTotal = parseFloat(totalSpan.textContent);
            totalSpan.textContent = (currentTotal - itemAmount).toFixed(2);
        }