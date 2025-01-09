document.addEventListener('DOMContentLoaded', () => {
  const changePasswordForm = document.getElementById('changePasswordForm');
  if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', handleChangePassword);
  }

  const changeEmailForm = document.getElementById('changeEmailForm');
  if (changeEmailForm) {
      changeEmailForm.addEventListener('submit', handleChangeEmail);
  }

  fetchUserDetails();
});

async function handleChangePassword(event) {
  event.preventDefault(); 

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
  }

  try {
      const response = await fetch('http://localhost:8080/user/dashboard/edit-profile', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              currentPassword: currentPassword,
              newPassword: newPassword,
              confirmNewPassword: confirmPassword,
          }),
      });

      if (response.ok) {
          alert('Password changed successfully!');
          document.getElementById('changePasswordForm').reset(); 
      } else {
          const errorData = await response.json();
          alert(`Error changing password: ${errorData}`);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
  }
}

async function handleChangeEmail(event) {
  event.preventDefault(); 

  const currentEmail = document.getElementById('currentEmail').value;
  const newEmail = document.getElementById('newEmail').value;

  try {
      const response = await fetch('http://localhost:8080/user/dashboard/edit-profile', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              emailAddress: newEmail,
          }),
      });

      if (response.ok) {
          alert('Email changed successfully!');
          document.getElementById('changeEmailForm').reset();
      } else {
          const errorData = await response.json();
          alert(`Error changing email: ${errorData}`);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
  }
}

async function fetchUserDetails() {
  try {
      const response = await fetch('http://localhost:8080/user/details', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
          const userData = await response.json();
          document.getElementById('currentEmail').value = userData.emailAddress; 
      } else {
          console.error('Failed to fetch user details.');
      }
  } catch (error) {
      console.error('Error fetching user details:', error);
  }
}

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