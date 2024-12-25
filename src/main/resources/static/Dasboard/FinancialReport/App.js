document.addEventListener("DOMContentLoaded", () => {
    const month = new Date().getMonth() + 1; // Get current month (1 = January, ..., 12 = December)
  
    fetch(`/financial-report/${month}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the financial report.");
        }
        return response.json();
      })
      .then((data) => {
        // Populate the financial report table
        document.getElementById("month").textContent = data.month;
        document.getElementById("monthlyIncome").textContent = `$${data.monthlyIncome.toFixed(2)}`;
        document.getElementById("essentialExpenses").textContent = `$${data.essentialExpenses.toFixed(2)}`;
        document.getElementById("optionalExpenses").textContent = `$${data.optionalExpenses.toFixed(2)}`;
        document.getElementById("totalExpenses").textContent = `$${data.totalExpenses.toFixed(2)}`;
        document.getElementById("netWorth").textContent = `$${data.netWorth.toFixed(2)}`;
        document.getElementById("goalsStatus").textContent = `${data.achievedGoals} / ${data.totalGoals}`;
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
            filename: `Financial_Report_Month_${month}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "A4", orientation: "landscape" },
        };

        html2pdf().set(options).from(reportElement).save();
    });
  });


