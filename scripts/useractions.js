// Importing LoginResponseDTO from a different directory
import { LoginResponseDTO } from '../models/LoginResponseDTO.js';

const endpoint = "https://nexusflow.azurewebsites.net/API/Users/";

// Function to create a new user
export async function createUser(userDTO) {
    try {
        console.log("Creating user...");
        console.log(JSON.stringify(userDTO));
        const createUserResponse = await fetch(endpoint + "Create", {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDTO)
        });
        
        // Check if user creation was successful
        if (createUserResponse.ok) {
            return true;
        } else {
            console.log("Failed to create user. HTTP status code:", createUserResponse.status, createUserResponse.statusText);
            return false;
        }
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

// Function to log in user
export async function loginUser(loginDTO) {
    try {
        const loginResponse = await fetch(endpoint + "Login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDTO)
        });

        // Parse the JSON response
        const responseData = await loginResponse.json();
            
        // Destructure the responseData object
        const { responseCode, responseDescription, accessToken } = responseData;

        // Create a new LoginResponseDTO object
        const loginResponseDTO = new LoginResponseDTO(responseCode, responseDescription, accessToken);

        if (loginResponse.ok) {
            return loginResponseDTO;
        } else {
            console.log("Failed to log in user. HTTP status code:", loginResponse.status, loginResponse.statusText);
            return null;
        }
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}

// Function to log out user
export async function logoutUser(accessToken) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);

    try {
        const logoutResponse = await fetch(endpoint + "Logout?" + params, {
            method: 'POST',
        });

        // Check if logout was successful
        if (logoutResponse.ok) {
            return true;
        } else {
            console.log("Failed to logout user. HTTP status code:", logoutResponse.status, logoutResponse.statusText);
            return false;
        }
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}

// Function to delete a user
export async function deleteUser(accessToken) {
    const params = new URLSearchParams();
    params.append('accesstoken', accessToken);

    try {
        const deleteUserResponse = await fetch(endpoint + "Delete?" + params, {
            method: 'DELETE',
        });

        // Check if user deletion was successful
        if (deleteUserResponse.ok) {
            return true;
        } else {
            console.log("Failed to delete user. HTTP status code:", deleteUserResponse.status, deleteUserResponse.statusText);
            return false;
        }
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}