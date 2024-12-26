document.addEventListener("DOMContentLoaded", () => {
    // const month = new Date().getMonth() + 1; // Get current month (1 = January, ..., 12 = December)
  
    // fetch(`/financial-report/${month}`)
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch the financial report.");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     // Populate the financial report table
    //     document.getElementById("month").textContent = data.month;
    //     document.getElementById("monthlyIncome").textContent = `$${data.monthlyIncome.toFixed(2)}`;
    //     document.getElementById("essentialExpenses").textContent = `$${data.essentialExpenses.toFixed(2)}`;
    //     document.getElementById("optionalExpenses").textContent = `$${data.optionalExpenses.toFixed(2)}`;
    //     document.getElementById("totalExpenses").textContent = `$${data.totalExpenses.toFixed(2)}`;
    //     document.getElementById("netWorth").textContent = `$${data.netWorth.toFixed(2)}`;
    //     document.getElementById("goalsStatus").textContent = `${data.achievedGoals} / ${data.totalGoals}`;
    //   })
    fetch(`/financial-report/all`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch financial reports for all months.");
      }
      return response.json();
    })
    .then((allData) => {
      const tableBody = document.querySelector("table tbody"); // Select the table body
      allData.forEach((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.month}</td>
          <td>$${data.monthlyIncome.toFixed(2)}</td>
          <td>$${data.essentialExpenses.toFixed(2)}</td>
          <td>$${data.optionalExpenses.toFixed(2)}</td>
          <td>$${data.totalExpenses.toFixed(2)}</td>
          <td>$${data.netWorth.toFixed(2)}</td>
          <td>${data.achievedGoals} / ${data.totalGoals}</td>
        `;
        tableBody.appendChild(row);
      });
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



