const goalList = document.getElementById('goal-list');
const graph = document.getElementById('graph');

function fetchGoals() {
    fetch("http://localhost:8080/goals", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            renderGoals(data);
        })
        .catch((error) => {
            console.error("Error fetching goals:", error);
        });
}

function addGoal() {
    const name = document.getElementById('goal-name').value.trim();
    const date = document.getElementById('goal-date').value;
    const targetValue = parseInt(document.getElementById('goal-target').value);
    const progressValue = parseInt(document.getElementById('goal-progress').value);

    if (!name || !date || isNaN(targetValue) || isNaN(progressValue)) {
        alert('Please fill in all fields with valid values!');
        return;
    }

    const payload = {
        name: name,
        date: date,
        targetValue: targetValue,
        progressValue: progressValue,
    };

    fetch("http://localhost:8080/goals/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to add goal");
        }
        return response.text();
    })
    .then((message) => {
        alert(message);
        fetchGoals(); 
        clearAddGoalFields();
    })
    .catch((error) => {
        console.error("Error adding goal:", error);
        alert("Error: " + error.message);
    });
}

function updateProgress() {
    const name = document.getElementById('update-goal-name').value.trim();
    const newProgressValue = parseInt(document.getElementById('update-progress-value').value);

    if (!name || isNaN(newProgressValue)) {
        alert('Please fill in all fields with valid values!');
        return;
    }

    const payload = {
        name: name,
        progressValue: newProgressValue,
    };

    fetch("http://localhost:8080/goals/update", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to update progress");
        }
        return response.text();
    })
    .then((message) => {
        alert(message);
        fetchGoals(); 
        clearUpdateProgressFields();
    })
    .catch((error) => {
        console.error("Error updating progress:", error);
        alert("Error: " + error.message);
    });
}

function renderGoals(goals) {
    goalList.innerHTML = '';
    graph.innerHTML = '';

    goals.forEach((goal) => {
        const progressPercentage = Math.min((goal.progressValue / goal.targetValue) * 100, 100);

        const goalElement = document.createElement('div');
        goalElement.className = 'goal';

        goalElement.innerHTML = `
            <div class="goal-info">
                <h3>${goal.name}</h3>
                <p>Start Date: ${goal.date}</p>
                <p>${goal.progressValue} / ${goal.targetValue}</p>
            </div>
            <div class="progress">
                <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                <p>${progressPercentage.toFixed(1)}%</p>
            </div>
            <button class="delete-btn" onclick="deleteGoal('${goal.name}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        goalList.appendChild(goalElement);

        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${progressPercentage * 2}px`;
        bar.setAttribute('data-value', `${progressPercentage.toFixed(1)}%`);
        bar.innerHTML = `<span>${goal.name}</span>`;
        graph.appendChild(bar);
    });
}


function deleteGoal(name) {
    if (!confirm(`Are you sure you want to delete the goal: ${name}?`)) {
        return;
    }

    fetch(`http://localhost:8080/goals/delete?name=${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to delete goal");
        }
        return response.text();
    })
    .then((message) => {
        alert(message);
        fetchGoals(); 
    })
    .catch((error) => {
        console.error("Error deleting goal:", error);
        alert("Error: " + error.message);
    });
}


function clearAddGoalFields() {
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-date').value = '';
    document.getElementById('goal-target').value = '';
    document.getElementById('goal-progress').value = '';
}

function clearUpdateProgressFields() {
    document.getElementById('update-goal-name').value = '';
    document.getElementById('update-progress-value').value = '';
}

document.addEventListener("DOMContentLoaded", fetchGoals);

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