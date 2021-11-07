import {Link, useLocation} from "react-router-dom";
import React from "react";
import "./style.css"
import PropTypes from "prop-types";
import {Box, Button, ButtonGroup, Stack} from "@mui/material";
import classNames from "classnames";
Navigation.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string)
};

/* @Todo Refactorer le composant navigation afin qu'il gère l'affichage simplement en se basant sur une props isLoggedIn  */

export function Navigation(props) {
    const userHasCompanyRole = props.roles.includes('ROLE_COMPANY');
    const [isLoggedIn, setIsLoggedIn] = React.useState(localStorage.getItem('logged_in'));
    const location = useLocation();

    function handleAddItem(event) {
        const loggedIn = localStorage.getItem('logged_in');
        if(loggedIn !== null)
        {
            setIsLoggedIn(loggedIn);
        }
    }

    function handleRemoveItem(event) {
        const loggedIn = localStorage.getItem('logged_in');
        if(!loggedIn)
        {
            setIsLoggedIn(false);
        }
    }

    React.useEffect(() => {
        window.addEventListener('addItem', handleAddItem);
        return () => {
            window.removeEventListener('addItem', handleAddItem);
        };
    }, []);

    React.useEffect(() => {
        window.addEventListener('removeItem', handleRemoveItem);
        return () => {
            window.removeEventListener('removeItem', handleRemoveItem);
        };
    }, []);

    function handleLogoutUser(event) {
        fetch(`${process.env.API_URL}/logout`).then((response) => {
            if(response.status === 204)
            {
                localStorage.removeItem('logged_in');
                window.dispatchEvent(new Event('removeItem'));
            }
        });
    }

    const CONTAINED = "contained";
    const OUTLINED = "outlined";

    return <Stack component="nav" direction="row">
        <ButtonGroup color="primary" fullWidth>
            {
                userHasCompanyRole && (
                    <Button variant={location.pathname === '/company/createSurvey' ? CONTAINED : OUTLINED}>
                        <Link className={classNames('navbar__links', {'navbar__links--inactive' : location.pathname !== '/company/createSurvey'})} to="/company/createSurvey">Créer un sondage</Link>
                    </Button>
                )
            }
            {
                !userHasCompanyRole && (
                    <Button variant={location.pathname === '/' ? CONTAINED : OUTLINED}>
                        <Link className={classNames('navbar__links', {'navbar__links--inactive' : location.pathname !== '/'})} to="/">Je ne suis pas un usercompany</Link>
                    </Button>
                )
            }
            <Button variant={location.pathname === '/' ? CONTAINED : OUTLINED}>
                <Link className={classNames('navbar__links', {'navbar__links--inactive' : location.pathname !== '/'})} to="/">Home</Link>
            </Button>
            <Button variant={location.pathname === '/surveys' ? CONTAINED : OUTLINED}>
                <Link className={classNames('navbar__links', {'navbar__links--inactive' : location.pathname !== '/surveys'})}to="/surveys">Mes sondages</Link>
            </Button>
            <Button variant={location.pathname === '/ranking' ? CONTAINED : OUTLINED}>
                <Link className={classNames('navbar__links', {'navbar__links--inactive' : location.pathname !== '/ranking'})}to="/ranking">Classement</Link>
            </Button>
            {
                !isLoggedIn && (
                    <Button variant={location.pathname === '/login' ? CONTAINED : OUTLINED}>
                        <Link className={classNames('navbar__links', {'navbar__links--inactive' : location.pathname !== '/login'})}to="/login">Se connecter</Link>
                    </Button>
                )
            }
            {
                isLoggedIn && (
                    <Button onClick={handleLogoutUser}>
                        Se déconnecter
                    </Button>
                )
            }
        </ButtonGroup>
    </Stack>;
}