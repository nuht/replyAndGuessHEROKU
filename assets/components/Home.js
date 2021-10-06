import React from "react";

export function Home() {
    const [listeDeQuestions, setListeDeQuestions] = React.useState([]);
    React.useEffect(() => {
        fetch('http://localhost:8000/api/questions').then((response) => {
            return response.json();
        }).then((body) => {
            let listeQuestion = body['hydra:member'];
            setListeDeQuestions(listeQuestion);
            console.log(body);
        }).catch((error) => {
            console.log(error);
        })
    }, [])
    return (
        <div>
            <h1>Home</h1>
            {listeDeQuestions.map((question, index) => {
                return <p key={index}>{question.text}</p>
            })}
        </div>
    );
}


/*
* he does that on the client side - creating an interceptor.
* He sends a request to GET the list, if the response is 401 Unauthorized,
* the interceptor automatically makes another request to /api/token/refresh,
* this triggers the listeners (I think), setting the cookies and then the interceptor
* runs the original GET request to get the list.
* You can use the interceptor from a npm package axios-auth-refresh.
*/