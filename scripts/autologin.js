import { logoutUser } from '../scripts/useractions.js';

function routeToPage(path) {
    if (window.location.pathname !== path) {
        window.location.href = ".." + path;
    }
}

export async function autoLogin() {
    // If there is already an access token, redirect to the dashboard
    if (localStorage.getItem('accessToken')) {

        if (!localStorage.getItem('repeatedLogins')) {
            localStorage.setItem('repeatedLogins', 1);
            localStorage.setItem('autologgedin', true);
            routeToPage("/dashboard/dashboard.html");
            return;
        } else {
            if (parseInt(localStorage.getItem('repeatedLogins')) >= 15) {
                localStorage.setItem('repeatedLogins', 0);
                var success = await logoutUser(localStorage.getItem('accessToken'));
                if (!success) {
                    alert("An error occurred while logging out. Please try again later.");
                }
                localStorage.removeItem('accessToken');
                routeToPage("/login/login.html");
                return;
            } else {
                var count = parseInt(localStorage.getItem('repeatedLogins'));
                count++;
                localStorage.setItem('repeatedLogins', count);
                localStorage.setItem('autologgedin', true);
                routeToPage("/dashboard/dashboard.html");
                return;
            }
        }   
    }

    routeToPage("/login/login.html");
    return;
}