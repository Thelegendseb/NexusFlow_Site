import { LoginDTO } from './models/loginDTO.js';
import { loginUser } from './scripts/useractions.js';
import { autoLogin } from './scripts/autologin.js';
import { createLoadingSpinner } from './scripts/domfactory.js';

await autoLogin();

const form = document.getElementById("form");

document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login');
    loginButton.addEventListener('click', async function(event) {
        event.preventDefault();

        var spinner = createLoadingSpinner();
        form.appendChild(spinner);
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // Create LoginDTO object
        const loginDTO = new LoginDTO(email, password);
        
        try {

            // Log in user and wait for the promise to resolve
            const loginResponse = await loginUser(loginDTO);

            spinner.remove();

            if (loginResponse.ResponseDescription == "USER_NOT_FOUND") {
                alert("User not found. Please check your email and password.");
                return;
            }

            if (loginResponse.ResponseDescription == "INCORRECT_PASSWORD") {
                alert("Invalid password. Please check your email and password.");
                return;
            }
            
            if (loginResponse == null) {
                alert("Failed to log in. Please try again later.");
                return;
            }

            localStorage.setItem('accessToken', loginResponse.AccessToken);
            window.location.href = "./../../dashboard/dashboard.html";
        } catch (error) {
            alert("Something went wrong. Please try again later.");
            spinner.remove();
        }

    });
});
