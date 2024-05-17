const endpoint = "https://nexusflow.azurewebsites.net/API/Referrals/";

// Function to see if a referral code is valid
export async function checkReferralCode(referralCode) {
    const params = new URLSearchParams();
    params.append('referralCode', referralCode);

    try {
        const referralResponse = await fetch(endpoint + "IsReferralCodeValid?" + params, {
            method: 'GET',
        });

        if (referralResponse.ok) {
            return await referralResponse.json();
        } else {
            console.log("Referral code is invalid. HTTP status code:", referralResponse.status, referralResponse.statusText);
            return false;
        }
    } catch (error) {
        console.log("Error:", error);
        return false;
    }
}