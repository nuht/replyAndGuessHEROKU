import React from "react";

export function Register() {
    let usernameInputRef = React.useRef(null);
    let passwordRef = React.useRef(null);
    let emailInputRef = React.useRef(null);
    const[error, setError] = React.useState(false);
    const[errorServer, setErrorServer] = React.useState(false);

    function handleOnSubmit(event) {
        event.preventDefault();
        if(passwordRef.current.value === '') {
            setError(true);
            return;
        }

        fetch('http://localhost:8000/api/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": emailInputRef.current.value,
                "plainpassword": passwordRef.current.value
            })
        }).then(response => {
            console.log(response);
            if(response.status !== 200) {
                setErrorServer(true);
            }
        }).catch(error => {
            /*
            * 1. Si le serveur renvoie un code précis alors créer un message en conséquence
            * 3. SI il y a une erreur de type string vide alors ajouter une bordure rouge sur le ou les input concerné
            * */
        })
    }

    return (
        <div>
            <h1>S&apos;inscrire</h1>
            {error &&  "le mot de passe ne peut pas être une string vide"}
            {errorServer && " cddscsdtest"}
            <form onSubmit={handleOnSubmit}>
                <label>
                    <input ref={emailInputRef} type="email" name="email" placeholder="email" />
                    <input ref={passwordRef} type="password" name="password" placeholder="password"/>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}