import { Link, useLocation } from "react-router-dom";
import React from "react";
import { NavbarLinks } from "./style";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Stack } from "@mui/material";

Navigation.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};

/* @Todo Refactorer le composant navigation afin qu'il gère l'affichage simplement en se basant sur une props isLoggedIn  */

export function Navigation(props) {
  const userHasCompanyRole = props.roles.includes("ROLE_COMPANY");
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    localStorage.getItem("logged_in")
  );
  const location = useLocation();

  function handleAddItem() {
    const loggedIn = localStorage.getItem("logged_in");
    if (loggedIn !== null) {
      setIsLoggedIn(loggedIn);
    }
  }

  function handleRemoveItem() {
    const loggedIn = localStorage.getItem("logged_in");
    if (!loggedIn) {
      setIsLoggedIn(false);
    }
  }

  React.useEffect(() => {
    window.addEventListener("addItem", handleAddItem);
    window.addEventListener("removeItem", handleRemoveItem);
    return () => {
      window.removeEventListener("addItem", handleAddItem);
      window.removeEventListener("removeItem", handleRemoveItem);
    };
  }, []);

  function handleLogoutUser() {
    fetch(`${process.env.API_URL}/logout`).then((response) => {
      if (response.status === 204) {
        localStorage.removeItem("logged_in");
        window.dispatchEvent(new Event("removeItem"));
      }
    });
  }

  const CONTAINED = "contained";
  const OUTLINED = "outlined";

  return (
    <Stack component="nav" direction="row">
      <ButtonGroup color="primary" fullWidth>
        {userHasCompanyRole && (
          <Button
            variant={
              location.pathname === "/company/createSurvey"
                ? CONTAINED
                : OUTLINED
            }
          >
            <NavbarLinks active={location.pathname === "/company/createSurvey"}>
              <Link to="/company/createSurvey">Créer un sondage</Link>
            </NavbarLinks>
          </Button>
        )}
        {!userHasCompanyRole && (
          <Button variant={location.pathname === "/" ? CONTAINED : OUTLINED}>
            <NavbarLinks active={location.pathname === "/"}>
              <Link to="/">Je ne suis pas un usercompany</Link>
            </NavbarLinks>
          </Button>
        )}
        <Button variant={location.pathname === "/" ? CONTAINED : OUTLINED}>
          <NavbarLinks active={location.pathname === "/"}>
            <Link to="/">Home</Link>
          </NavbarLinks>
        </Button>
        <Button
          variant={location.pathname === "/surveys" ? CONTAINED : OUTLINED}
        >
          <NavbarLinks active={location.pathname === "/surveys"}>
            <Link to="/surveys">Mes sondages</Link>
          </NavbarLinks>
        </Button>
        {!isLoggedIn && (
          <Button
            variant={location.pathname === "/login" ? CONTAINED : OUTLINED}
          >
            <NavbarLinks active={location.pathname === "/login"}>
              <Link to="/login">Se connecter</Link>
            </NavbarLinks>
          </Button>
        )}
        {isLoggedIn && (
          <Button onClick={handleLogoutUser}>Se déconnecter</Button>
        )}
      </ButtonGroup>
    </Stack>
  );
}
