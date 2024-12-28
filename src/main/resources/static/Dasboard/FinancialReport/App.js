document.addEventListener("DOMContentLoaded", () => {

  // Function call to budget api's to get data
  function getExpensesForCurrentMonth() {
    return Promise.all([
      fetch("http://localhost:8080/budget/essential-expenses", { method: "GET" }).then((response) =>
        response.json()
      ),
      fetch("http://localhost:8080/budget/optional-spending", { method: "GET" }).then((response) =>
        response.json()
      ),
    ]).then(([essentialExpenses, optionalSpending]) => {
      const totalEssential = essentialExpenses.reduce((total, expense) => total + expense.amount, 0);
      const totalOptional = optionalSpending.reduce((total, spending) => total + (spending ? spending.amount : 0), 0);
      const totalExpenses = totalEssential + totalOptional;
  
      return {
        essential: totalEssential,
        optional: totalOptional,
        total: totalExpenses,
      };
    });
  }

  // To get the report for all months
  fetch(`/financial-report/all`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch financial reports for all months.");
    }
    return response.json();
  })
  .then(async (allData) => {
    const tableBody = document.querySelector("table tbody"); // Select the table body

    for (const data of allData) {
      const row = document.createElement("tr");

      if (data.month.toLowerCase() === "december") {
        // Fetch current month expenses for December
        const expenses = await getExpensesForCurrentMonth();
        row.innerHTML = `
          <td>${data.month}</td>
          <td>$${data.monthlyIncome.toFixed(2)}</td>
          <td>$${expenses.essential.toFixed(2)}</td>
          <td>$${expenses.optional.toFixed(2)}</td>
          <td>$${expenses.total.toFixed(2)}</td>
          <td>$${data.netWorth.toFixed(2)}</td>
          <td>${data.achievedGoals} / ${data.totalGoals}</td>
        `;
      } else {
        // Render other months as-is
        row.innerHTML = `
          <td>${data.month}</td>
          <td>$${data.monthlyIncome.toFixed(2)}</td>
          <td>$${data.essentialExpenses.toFixed(2)}</td>
          <td>$${data.optionalExpenses.toFixed(2)}</td>
          <td>$${data.totalExpenses.toFixed(2)}</td>
          <td>$${data.netWorth.toFixed(2)}</td>
          <td>${data.achievedGoals} / ${data.totalGoals}</td>
        `;
      }

      tableBody.appendChild(row);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    alert("Failed to load the financial report. Please try again later.");
  });

  
    // Download Report (using a library like jsPDF or server-generated PDF)
    document.getElementById("downloadReport").addEventListener("click", () => {
        const reportElement = document.querySelector(".report"); // Target the report div
        const options = {
            margin: 1,
            filename: `Financial_Report_Month.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "A4", orientation: "landscape" },
        };

        html2pdf().set(options).from(reportElement).save();
    });
  });


// user image clicking and dropdown
document.addEventListener("DOMContentLoaded", () => {
  const userImage = document.getElementById("userImage");
  const dropdownMenu = document.getElementById("dropdownMenu");

  // Toggle dropdown visibility on image click
  userImage.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent triggering outside click event
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", () => {
    dropdownMenu.style.display = "none";
  });

  // Logout button functionality
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", () => {
    alert("Logged out!");
    window.location.href = "/User_login/login.html"; // Adjust redirection path if needed
  });
});



