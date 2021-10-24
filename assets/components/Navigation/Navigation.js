import {Link, useLocation} from "react-router-dom";
import React from "react";
import "./style.css"
import PropTypes from "prop-types";
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

    return <nav>
        <ul>
            {
                userHasCompanyRole && (
                    <li>
                        <Link className={location.pathname === '/company/createSurvey' ? 'active' : ''} to="/company/createSurvey">Créer un sondage</Link>
                    </li>
                )
            }
            {
                !userHasCompanyRole && (
                    <li>
                        <Link className={location.pathname === '/' ? 'active' : ''} to="/">Je ne suis pas un usercompany</Link>
                    </li>
                )
            }
            <li>
                <Link className={location.pathname === '/' ? 'active' : ''} to="/">Home</Link>
            </li>
            <li>
                <Link className={location.pathname === '/questions' ? 'active' : ''} to="/questions">Liste des questions</Link>
            </li>
            <li>
                <Link className={location.pathname === '/ranking' ? 'active' : ''} to="/ranking">Classement</Link>
            </li>
            {
                !isLoggedIn && (
                    <li>
                        <Link className={location.pathname === '/login' ? 'active' : ''} to="/login">Se connecter</Link>
                    </li>
                )
            }
            {
                isLoggedIn && (
                    <li>
                        <button onClick={handleLogoutUser}>Se déconnecter</button>
                    </li>
                )
            }
        </ul>
    </nav>;
}