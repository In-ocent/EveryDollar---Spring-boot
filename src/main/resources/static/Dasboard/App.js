let chart;

const chartData = {
  netWorth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Net Worth ($)',
      data: [], 
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
      data: [], 
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
      data: [], 
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
      chartData.netWorth.datasets[0].data = chartDataResponse.netWorthData.map(value => parseFloat(value) || 0);
      chartData.assets.datasets[0].data = chartDataResponse.assetsData.map(value => parseFloat(value) || 0);
      chartData.debt.datasets[0].data = chartDataResponse.debtsData.map(value => parseFloat(value) || 0);

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
  
function createChart(data) {
  const dataSetData = data.datasets[0];
  const ctx = document.getElementById('lineChart').getContext('2d');
  if (chart) {
    chart.destroy();

  }
  
  const minYValue = Math.min(...data.datasets[0].data);
  const maxYValue = Math.max(...data.datasets[0].data);
  
  const range = maxYValue - minYValue;
  const stepSize = range / 5 || 1; 
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels, 
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
            min: minYValue, 
            max: maxYValue, 
            stepSize: stepSize, 
            callback: (value) => `$${value.toLocaleString()}`,
          },
        },
      },
    },
  });
}

function setActiveButton(buttonId) {
  document.querySelectorAll('.chart-buttons button').forEach(button => {
    button.classList.remove('active');
  });
  document.getElementById(buttonId).classList.add('active');
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



const assetCtx = document.getElementById("assetChart").getContext("2d");
if (currentMonthAssetDetails && currentMonthAssetDetails.length > 0) {
  new Chart(assetCtx, {
    type: "doughnut",
    data: {
      labels: currentMonthAssetDetails.map(item => item.name || "Unknown"), 
      datasets: [
        {
          data: currentMonthAssetDetails.map(item => item.value || 0), 
          backgroundColor: ["#3ABEF9", "#A7E6FF", "#3572EF"], 
          borderWidth: 1, 
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

const debtCtx = document.getElementById("debtChart").getContext("2d");
if (currentMonthDebtDetails && currentMonthDebtDetails.length > 0) {
  new Chart(debtCtx, {
    type: "doughnut",
    data: {
      labels: currentMonthDebtDetails.map(item => item.name || "Unknown"), 
      datasets: [
        {
          data: currentMonthDebtDetails.map(item => item.value || 0), 
          backgroundColor: ["#3572EF", "#3ABEF9", "#A7E6FF"], 
          borderWidth: 1, 
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

          const totalBudgetElement = document.querySelector(".card.small:nth-of-type(2) h1");
          if (totalBudgetElement) {
              totalBudgetElement.textContent = `$${(totalEssential + totalOptional).toFixed(2)}`;
          } else {
              console.error("Total Budget element not found in the DOM.");
          }

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

  updateTotalBudget();

  document.addEventListener("click", () => {
    dropdownMenu.style.display = "none";
  });

  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", () => {
    alert("Logged out!");
    window.location.href = "/User_login/login.html"; 
  });
});





 