import {Link, useLocation} from "react-router-dom";
import React from "react";
import "./style.css"

export function Navigation() {
    const location = useLocation();
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
            <li>
                <Link className={location.pathname === '/login' ? 'active' : ''} to="/login">Se connecter</Link>
            </li>
            <li>
                <Link to="/logout">Se déconnecter</Link>
            </li>
        </ul>
    </nav>;
}