import React from "react";
import PropTypes from "prop-types";
import {Button} from "@mui/material";
Login.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export function Login(props)
{
    let emailInputRef = React.useRef(null);
    let passwordRef = React.useRef(null);
    const[error, setError] = React.useState(false);

    function handleOnSubmit(event) {
        event.preventDefault();

        fetch(`${process.env.API_URL}/api/login`, {
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
                localStorage.setItem('logged_in', 'true');
                props.history.push("/");
                window.dispatchEvent(new Event('addItem'));
            }

        }).catch(error => {
        });

    }

    return (<div>
        {error &&  "le mot de passe ne peut pas être une string vide"}
        <form onSubmit={handleOnSubmit}>
            <label htmlFor="email">Entrez votre email:</label>
            <input id="email" ref={emailInputRef} type="email" name="email" placeholder="email" />

            <label htmlFor="password">Entrez votre mot de passe:</label>
            <input id="password" ref={passwordRef} type="password" name="password" placeholder="password"/>

            <Button variant="contained" type="submit">Se connecter</Button>
        </form>
    </div>);
}