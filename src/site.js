// The base API Management URI
const baseUri = "https://duendebffpoc.azure-api.net";

// The Azure AD application registration client ID
const clientId = "7edbc56c-0081-44ef-93a4-fa33d982566e";

// The Azure AD tenant ID
const authEndpoint = "https://login.microsoftonline.com/16b3c013-d300-468d-ac64-7eda0820b6d3/oauth2/v2.0/authorize";

const logoutEndpoint = "https://login.microsoftonline.com/16b3c013-d300-468d-ac64-7eda0820b6d3/oauth2/v2.0/logout";

// The scope for the access token request to call the Microsoft Graph API
// If a refresh token is also required for the application, add "offline_access" to the scope
// e.g. const scope = "https://graph.microsoft.com/.default offline_access"
const scope = "https://graph.microsoft.com/.default"

// Redirects the user to the login endpoint with the appropriate parameters to begin the authentication flow
const login = () => {
    window.location.href =
        `${authEndpoint}?response_type=code&redirect_uri=${baseUri}/auth/callback&client_id=${clientId}&scope=${scope}`;
};

// Logs the user out of the application by redirecting to the logout endpoint of Azure AD which will in turn call the logout endpoint of the application to remove the cookie
// This allows the user to be logged out of Azure AD and the single-page application itself by deleting the cookie
// If you do not want to log the user out of Azure AD, you can remove the redirect to the logout endpoint of Azure AD and just call the logout endpoint of the application
const logout = () => {
    window.location.href = `?post_logout_redirect_uri=${baseUri}/auth/logout`;
};

// Calls the graph endpoint and displays the result
const callApi = async () => {
    // Display loading message
    document.getElementById("result").innerText = "Loading...";

    // Call the Graph API endpoint
    await fetch(`${baseUri}/graph/me`, {
        credentials: "include",
    })
        .then(async (response) => {
            if (response.status === 401) {
                document.getElementById("result").innerText = "User is not authenticated.";
            } else {
                document.getElementById("result").innerText = JSON.stringify(await response.json(), null, 4);
            }
        })
        .catch((error) => {
            document.getElementById("result").innerText = error;
        });
};

// Exports the functions to be used in the HTML
export { login, logout, callApi };