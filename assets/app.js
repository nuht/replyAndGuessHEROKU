/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import ReactDOM from 'react-dom'
import React from 'react'

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';
import {Home} from "./components/Home";

/*
* Liste :
* Bouton de redirection vers connexion
* Bouton de redirection vers inscription
* Requête pour la liste des questions sur la home
* S'il est connecté , bouton logout à la place du bouton connexion
* */
function App() {
    return <Home/>;
}

ReactDOM.render(<App/>, document.getElementById('root'));