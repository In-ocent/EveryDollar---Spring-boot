document.addEventListener("DOMContentLoaded", () => {

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

  fetch(`/financial-report/all`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch financial reports for all months.");
    }
    return response.json();
  })
  .then(async (allData) => {
    const tableBody = document.querySelector("table tbody"); 

    for (const data of allData) {
      const row = document.createElement("tr");

      if (data.month.toLowerCase() === "january") {
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

  
    document.getElementById("downloadReport").addEventListener("click", () => {
        const reportElement = document.querySelector(".report"); 
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



