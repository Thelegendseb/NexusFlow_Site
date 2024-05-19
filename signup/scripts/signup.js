import { UserDTO } from '../../models/userDTO.js';
import { LoginDTO } from '../../models/loginDTO.js';

import { createUser, loginUser } from '../../scripts/useractions.js';

import { createLoadingSpinner } from '../../scripts/domfactory.js';

import { checkReferralCode } from '../../scripts/referralactions.js';

const form = document.getElementById("form");

document.addEventListener('DOMContentLoaded', async function() {

    // ==================== REFERRAL CODE ====================
    let referralCode = prompt("Enter your referral code:");
    // TODO: Loading Bar Here
    if (referralCode) {
        let validReferral = await checkReferralCode(referralCode);
        if (validReferral.isValid == true) {
            alert("Referral code for " + validReferral.user + " has been entered.");
        } else {
            alert("The referral code you entered is invalid.");
            window.location.href = "../../index.html";
        }
    } else {
        alert("You must enter a referral code to sign up.");
         window.location.href = "../../index.html";
    }
    // ==================== REFERRAL CODE ====================

    const signupButton = document.getElementById('signup');
    signupButton.addEventListener('click', async function(event) {
        event.preventDefault();

        var spinner = createLoadingSpinner();
        form.appendChild(spinner);
        
        const firstname = document.getElementById('firstname').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create UserDTO object
        const userDTO = new UserDTO(firstname, surname, email, password);

        try {
            // Create user and wait for the promise to resolve
            const success = await createUser(userDTO);

            if (success) {
                console.log("User created successfully. Attempting to log in user...");
                // Create LoginDTO object
                const loginDTO = new LoginDTO(email, password);
                // Log in user and wait for the promise to resolve
                const loginResponse = await loginUser(loginDTO);  
                
                spinner.remove();

                localStorage.setItem('accessToken', loginResponse.AccessToken);
                localStorage.setItem('firsttimelogin', true);
                window.location.href = "../../dashboard/dashboard.html";
            } else {
                spinner.remove();
                alert("Failed to create user. Please try again later.");
            }
        } catch (error) {
            spinner.remove();
            console.error("Error:", error);
            alert("An error occurred while processing your request. Please try again later.");
        }
    });
});



