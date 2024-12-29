document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value; // Use 'email' field as 'username'
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/user/login', { // Backend login API
        method: 'POST',
        body: JSON.stringify({ username, password }), // Send username and password
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies for session management
    })
    .then(response => {
        if (response.ok) {
            // Redirect to the dashboard upon successful login
            window.location.href = '/Dashboard/'; // Adjust dashboard path if needed
        } else {
            // Handle login failure
            response.text().then((errorMessage) => {
                alert(errorMessage || 'Login failed. Please check your credentials.');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});