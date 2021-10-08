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
                <Link className={location.pathname === '/register' ? 'active' : ''} to="/register">S'inscrire</Link>
            </li>
        </ul>
    </nav>;
}