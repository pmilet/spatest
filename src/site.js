const config = {
    apimBaseUri: "https://duendebffpoc.azure-api.net",
    //apimBaseUri: "https://ribapim.developer.azure-api.net",
    clientId: "web",
    //authEndpoint: "https://identityserverribtest.azurewebsites.net/connect/authorize",
    logoutEndpoint: "https://identityserverribtest.azurewebsites.net/connect/endsession",
    authEndpoint: "https://ribidentityserver.azurewebsites.net/connect/authorize",
    //logoutEndpoint: "https://ribidentityserver.azurewebsites.net/connect/endsession",
    scope: "api1"
};

const buildLoginUrl = () => {
    return `${config.authEndpoint}?response_type=code&redirect_uri=${config.apimBaseUri}/auth/callback&client_id=${config.clientId}&scope=${config.scope}`;
};

const buildLogoutUrl = () => {
    return `${config.logoutEndpoint}?post_logout_redirect_uri=${config.apimBaseUri}/auth/logout`;
};

const login = () => {
    window.location.href = buildLoginUrl();
};

const logout = () => {
    window.location.href = buildLogoutUrl();
};

const callApi = async () => {
    const resultElement = document.getElementById("result");
    resultElement.innerText = "Loading...";

    try {
        const response = await fetch(`${config.apimBaseUri}/api/identity`, {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401) {
            resultElement.innerText = "User is not authenticated.";
        } else {
            const data = await response.json();
            resultElement.innerText = JSON.stringify(data, null, 4);
        }
    } catch (error) {
        resultElement.innerText = `Error: ${error.message}`;
    }
};

export { login, logout, callApi };
