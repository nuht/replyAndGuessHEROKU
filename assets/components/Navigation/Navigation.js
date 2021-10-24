import {Link, useLocation} from "react-router-dom";
import React from "react";
import "./style.css"



export function Navigation() {
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
        fetch('http://127.0.0.1:8000/logout').then((response) => {
            if(response.status === 204)
            {
                localStorage.removeItem('logged_in');
                window.dispatchEvent(new Event('removeItem'));
            }
        });
    }

    return <nav>
        <ul>
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