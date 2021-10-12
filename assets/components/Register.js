import React from "react";

export function Register() {
    let usernameInputRef = React.useRef(null);
    let passwordRef = React.useRef(null);
    let emailInputRef = React.useRef(null);
    const[error, setError] = React.useState(false);
    const[errorServer, setErrorServer] = React.useState(false);

    function handleOnSubmit(event) {
        event.preventDefault();
        if(usernameInputRef.current.value === '' || passwordRef.current.value === '') {
            setError(true);
        }

        fetch('http://localhost:8002/api/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": emailInputRef.current.value,
                "plainpassword": passwordRef.current.value,
                "username": usernameInputRef.current.value
            })
        }).catch(error => {
            /*
            * 1. Si le serveur renvoie un code précis alors créer un message en conséquence
            * 2. 500 mauvais traitement,   error duplicate
            * 3. SI il y a une erreur de type string vide alors ajouter une bordure rouge sur le ou les input concerné
            * */
            /*console.log(error)*/
        })
    }

    return (
        <div>
            <h1>S&apos;inscrire</h1>
            {error && "le nom d'utilisateur ou le mot de passe ne peut pas être une string vide"}
            {errorServer && "test"}
            <form onSubmit={handleOnSubmit}>
                <label>
                    <input ref={emailInputRef} type="email" name="email" placeholder="email" />
                    <input ref={usernameInputRef} type="text" name="username" placeholder="username"/>
                    <input ref={passwordRef} type="password" name="password" placeholder="password"/>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}