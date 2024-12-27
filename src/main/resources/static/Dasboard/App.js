// Variables to store chart and data
let chart;

// Chart data for different buttons
const chartData = {
  netWorth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Net Worth ($)',
      data: [], // Dynamic data will be loaded here
      borderColor: '#608BC1',
      backgroundColor: 'rgba(51, 179, 166, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#133E87',
      pointBorderColor: '#133E87',
      pointRadius: 5
    }]
  },
  assets: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Assets ($)',
      data: [], // Dynamic data will be loaded here
      borderColor: '#608BC1',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#133E87',
      pointBorderColor: '#133E87',
      pointRadius: 5
    }]
  },
  debt: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Debt ($)',
      data: [], // Dynamic data will be loaded here
      borderColor: '#608BC1',
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#133E87',
      pointBorderColor: '#133E87',
      pointRadius: 5
    }]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchChartData();
});

function fetchChartData() {
  fetch("/Dashboard/chart-data")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to fetch chart data.");
    }
    return response.json();
  })
  .then(chartDataResponse => {
    // Update datasets dynamically
    chartData.netWorth.datasets[0].data = chartDataResponse.netWorthData.map(value => parseFloat(value) || 0);
    chartData.assets.datasets[0].data = chartDataResponse.assetsData.map(value => parseFloat(value) || 0);
    chartData.debt.datasets[0].data = chartDataResponse.debtsData.map(value => parseFloat(value) || 0);

    // Initialize with Net Worth chart
    createChart(chartData.netWorth);
    setActiveButton('btnNetWorth');
  })
  .catch(error => {
    console.error("Error fetching chart data:", error);
    alert("Failed to load chart data. Please try again later.");
  });
}

document.getElementById('btnNetWorth').addEventListener('click', () => {
  setActiveButton('btnNetWorth');
  createChart(chartData.netWorth);
});

document.getElementById('btnAssets').addEventListener('click', () => {
  setActiveButton('btnAssets');
  createChart(chartData.assets);
});

document.getElementById('btnDebt').addEventListener('click', () => {
  setActiveButton('btnDebt');
  createChart(chartData.debt);
});
  
// Function to create a chart
function createChart(data) {
  const dataSetData = data.datasets[0];
  const ctx = document.getElementById('lineChart').getContext('2d');
  // Destroy existing chart if present
  if (chart) {
    chart.destroy();

  }
  
  // Dynamically calculate max value for the Y-axis
  const minYValue = Math.min(...data.datasets[0].data);
  const maxYValue = Math.max(...data.datasets[0].data);
  
  // Calculate step size dynamically (e.g., 10% of the range or a fixed number)
  const range = maxYValue - minYValue;
  const stepSize = range / 5 || 1; 
  // Recreate chart
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels, // Ensure the labels are correctly passed
      datasets: [
        {
          label: data.datasets[0].label,
          data: data.datasets[0].data,
          borderColor: data.datasets[0].borderColor,
          backgroundColor: data.datasets[0].backgroundColor,
          fill: data.datasets[0].fill,
          tension: data.datasets[0].tension,
          pointBackgroundColor: data.datasets[0].pointBackgroundColor,
          pointBorderColor: data.datasets[0].pointBorderColor,
          pointRadius: data.datasets[0].pointRadius,
        },
      ],
// Dynamically updated datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
          backgroundColor: data.datasets[0].borderColor,
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#133E87',
          },
        },
        y: {
          grid: {
            color: '#eee',
          },
          ticks: {
            color: '#133E87',
            min: minYValue, // Set dynamic minimum
            max: maxYValue, // Set dynamic maximum
            stepSize: stepSize, // Set dynamic step size
            callback: (value) => `$${value.toLocaleString()}`, // Format ticks
          },
          // suggestedMax: maxYValue + maxYValue * 0.1, // Add 10% padding above max value
        },
      },
    },
  });
}

// Function to set the active button
function setActiveButton(buttonId) {
  document.querySelectorAll('.chart-buttons button').forEach(button => {
    button.classList.remove('active');
  });
  document.getElementById(buttonId).classList.add('active');
}

// Event listeners for buttons
document.getElementById('btnNetWorth').addEventListener('click', () => {
  setActiveButton('btnNetWorth');
  createChart(chartData.netWorth);
});

document.getElementById('btnAssets').addEventListener('click', () => {
  setActiveButton('btnAssets');
  createChart(chartData.assets);
});

document.getElementById('btnDebt').addEventListener('click', () => {
  setActiveButton('btnDebt');
  createChart(chartData.debt);
});

// Initialize with Net Worth data
// createChart(chartData.netWorth);
// setActiveButton('btnNetWorth');





// Render Doughnut Chart for Assets
const assetCtx = document.getElementById("assetChart").getContext("2d");
if (currentMonthAssetDetails && currentMonthAssetDetails.length > 0) {
  new Chart(assetCtx, {
    type: "doughnut",
    data: {
      labels: currentMonthAssetDetails.map(item => item.name || "Unknown"), // Labels for the chart (asset names)
      datasets: [
        {
          data: currentMonthAssetDetails.map(item => item.value || 0), // Data for the chart (asset values)
          backgroundColor: ["#3ABEF9", "#A7E6FF", "#3572EF"], // Colors for the doughnut slices
          borderWidth: 1, // Border width for each slice
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
}

// Render Doughnut Chart for Debts
const debtCtx = document.getElementById("debtChart").getContext("2d");
if (currentMonthDebtDetails && currentMonthDebtDetails.length > 0) {
  new Chart(debtCtx, {
    type: "doughnut",
    data: {
      labels: currentMonthDebtDetails.map(item => item.name || "Unknown"), // Labels for the chart (debt names)
      datasets: [
        {
          data: currentMonthDebtDetails.map(item => item.value || 0), // Data for the chart (debt values)
          backgroundColor: ["#3572EF", "#3ABEF9", "#A7E6FF"], // Colors for the doughnut slices
          borderWidth: 1, // Border width for each slice
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
}

function updateTotalBudget() {
  Promise.all([
      fetch("http://localhost:8080/budget/essential-expenses", { method: "GET" }).then(response => response.json()),
      fetch("http://localhost:8080/budget/optional-spending", { method: "GET" }).then(response => response.json()),
  ])
      .then(([essentialExpenses, optionalSpending]) => {
          let totalEssential = essentialExpenses.reduce((total, expense) => total + expense.amount, 0);
          let totalOptional = optionalSpending.reduce((total, spending) => total + (spending ? spending.amount : 0), 0);

          // Update Total Budget
          const totalBudgetElement = document.querySelector(".card.small:nth-of-type(2) h1");
          if (totalBudgetElement) {
              totalBudgetElement.textContent = `$${(totalEssential + totalOptional).toFixed(2)}`;
          } else {
              console.error("Total Budget element not found in the DOM.");
          }

      })
      .catch(error => console.error("Error updating total budget:", error));
}


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

  updateTotalBudget();

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





 