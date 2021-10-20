import React from "react";

export function Login(props)
{
    let emailInputRef = React.useRef(null);
    let passwordRef = React.useRef(null);
    const[error, setError] = React.useState(false);

    function handleOnSubmit(event) {
        event.preventDefault();
        console.log(passwordRef.current.value);

        fetch('http://127.0.0.1:8000/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": emailInputRef.current.value,
                "password": passwordRef.current.value
            })
        }).then(response => {
            console.log(response);
            if(response.status !== 204) {
                setError(true);
            }
            if(response.status === 204)
            {
                props.history.push("/");
            }

        }).catch(error => {
        })

    }

    return (<div>
        {error &&  "le mot de passe ne peut pas être une string vide"}
        <form onSubmit={handleOnSubmit}>
            <label htmlFor="email">Entrez votre email:</label>
            <input id="email" ref={emailInputRef} type="email" name="email" placeholder="email" />

            <label htmlFor="password">Entrez votre mot de passe:</label>
            <input id="password" ref={passwordRef} type="password" name="password" placeholder="password"/>

            <button type="submit">Se connecter</button>
        </form>
    </div>);
}