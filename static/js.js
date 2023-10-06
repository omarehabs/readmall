// Function to parse the URL and extract query parameters

function getQueryParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
}

const resetPasswordForm = document.getElementById('resetPasswordForm');
const userIdInput = document.getElementById('userId');
const tokenInput = document.getElementById('token');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const messageDiv = document.getElementById('message');

const submitButton = document.getElementById('submitButton');
// Populate the hidden input fields with userId and token from the query parameters
const queryParams = getQueryParams();
userIdInput.value = queryParams.userId || '';
tokenInput.value = queryParams.token || '';

submitButton.addEventListener('click', () => {
    


    const userId = userIdInput.value;
    const token = tokenInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const resetPasswordData = {
        userId,
        token,
        password,
    };
    
    fetch('http://localhost:3000/api/v1/users/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetPasswordData)
    })
        .then(response => {
            if (response.ok) {
                // Password reset was successful (status code 200)
                return response.json();
            } else {
                // Handle error response
                throw new Error('Failed to reset password. Please try again.');
            }
        })
        .then(data => {
            // Display success message
            
            messageDiv.textContent = data.message;
        })
        .catch(error => {
            // Display error message
            
            messageDiv.textContent = error.message;
            
        });
});