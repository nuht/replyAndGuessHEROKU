import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
Login.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export function Login(props) {
  let emailInputRef = React.useRef(null);
  let passwordInputRef = React.useRef(null);
  const [error, setError] = React.useState("");

  function handleOnSubmit(event) {
    event.preventDefault();
    const emailValue = emailInputRef.current.value;
    const passwordValue = passwordInputRef.current.value;
    if (emailValue === "" || passwordValue === "") {
      setError("Les champs ne doivent pas être vide");
      return;
    }

    fetch(`${process.env.API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
      }),
    })
      .then((response) => {
        if (response.status !== 204) {
          setError("Il y a eu une erreur :" + response.statusText);
        }
        if (response.status === 204) {
          localStorage.setItem("logged_in", "true");
          props.history.push("/");
          window.dispatchEvent(new Event("addItem"));
        }
      })
      .catch(() => {});
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="email">Entrez votre email:</label>
        <input
          id="email"
          ref={emailInputRef}
          type="email"
          name="email"
          placeholder="email"
        />

        <label htmlFor="password">Entrez votre mot de passe:</label>
        <input
          id="password"
          ref={passwordInputRef}
          type="password"
          name="password"
          placeholder="password"
        />

        <Button variant="contained" type="submit">
          Se connecter
        </Button>
      </form>
    </div>
  );
}
