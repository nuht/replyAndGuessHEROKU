import React from "react";

export function Home() {
    const [listeDeQuestions, setListeDeQuestions] = React.useState([]);
    React.useEffect(() => {
        fetch('http://localhost:8000/api/questions').then((response) => {
            return response.json();
        }).then((body) => {
            setListeDeQuestions(body['hydra:member']);
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