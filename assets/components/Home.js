import React from "react";

export function Home() {
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}


/*
* he does that on the client side - creating an interceptor.
* He sends a request to GET the list, if the response is 401 Unauthorized,
* the interceptor automatically makes another request to /api/token/refresh,
* this triggers the listeners, setting the cookies and then the interceptor
* runs the original GET request to get the list.
* You can use the interceptor from a npm package axios-auth-refresh.
*
* stockage access token en mémoire             on peut faire un local storage is connected true pour considérer qu'il est tj connecté
*
*
*/