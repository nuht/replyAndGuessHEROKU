/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import ReactDOM from 'react-dom'
import React from 'react'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';
import 'normalize-css';
import {Home} from "./components/Home";
import {Navigation} from "./components/Navigation/Navigation";
import {Register} from "./components/Register";
import {Login} from "./components/Login/Login";
import {ProtegerPage} from "./components/ProtegerPage";
import {CreateSurvey} from "./components/Company/CreateSurvey";

/*
* Liste :
* Bouton de redirection vers connexion
* Bouton de redirection vers inscription
* Requête pour la liste des questions sur la home
* S'il est connecté , bouton logout à la place du bouton connexion
* */
function App() {
    const [roles, setRoles] = React.useState([]);
    React.useEffect(()=> {
        if(localStorage.getItem('logged_in') === 'true')
        {
            getAndSetUserRoles();
        }
    },[]);

    function getAndSetUserRoles() {
        fetch(`${process.env.API_URL}/api/me`).then((response) => {
            return response.json();
        }).then(body => {
            setRoles(body.jwt.roles);
        });
    }

    function handleAddItem() {
        const isLoggedIn = localStorage.getItem('logged_in');


        if(isLoggedIn)
        {
            getAndSetUserRoles();
        }
    }

    React.useEffect(() => {
        window.addEventListener('addItem', handleAddItem);
        return () => {
            window.removeEventListener('addItem', handleAddItem);
        };
    }, []);

    return (
        <React.Fragment>
            <Navigation roles = {roles} />
            <Switch>
                <Route path='/' exact>
                    <ProtegerPage>
                        <Home/>
                    </ProtegerPage>
                </Route>
                <Route path='/company/createSurvey'>
                    <CreateSurvey/>
                </Route>
                <Route
                    path='/login'
                    exact
                    render={(routeProps) => {
                        return <Login
                            {...routeProps}
                        />
                    }}
                >
                </Route>
                <Route path='/questions'>
                    <h1>Liste des questions</h1>
                </Route>
                <Route path='/ranking'>
                    <h1>Classements</h1>
                </Route>
                <Route path='/register'>
                    <Register/>
                </Route>
            </Switch>
        </React.Fragment>
    );
}

ReactDOM.render(<Router><App/></Router>, document.getElementById('root'));