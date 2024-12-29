document.querySelector('#forms').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;


    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Send form data to the server
    fetch('http://localhost:8080/user/register', {
        method: 'POST',
        body: JSON.stringify({
            emailAddress: email, // Ensure the key matches your UserEntity field
            username: username,
            password: password,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.text(); // Parse the response as text
            } else {
                throw new Error('Registration failed');
            }
        })
        .then((message) => {
            alert(message); // Display success message
            window.location.href = '../User_login/login.html'; // Redirect to login page
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred during registration. Please try again later.');
        });
});