/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import ReactDOM from 'react-dom'
import React from 'react'
import {BrowserRouter as Router, Route, Switch, withRouter} from "react-router-dom";

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
import {Container} from "@mui/material";
import {NotFound} from "./components/NotFound";
import {Survey} from "./components/Survey/Survey";
import PropTypes from "prop-types";
import {SurveyList} from "./components/SurveyList/SurveyList";
import {SurveyEdit} from "./components/Survey/SurveyEdit";

App.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

/*
* Liste :
* Bouton de redirection vers connexion
* Bouton de redirection vers inscription
* Requête pour la liste des questions sur la home
* S'il est connecté , bouton logout à la place du bouton connexion
* */
function App(props) {
    const [roles, setRoles] = React.useState([]);
    const [id, setId] = React.useState(null);
    React.useEffect(()=> {
        if(localStorage.getItem('logged_in') === 'true')
        {
            getAndSetUserRoles();
        }
    },[]);

    function getAndSetUserRoles() {
        fetch(`${process.env.API_URL}/api/me`).then((response) => {
            if(response.status === 401)
            {
                props.history.push("/login");
            }

            return response.json();
        }).then(body => {
            setRoles(body.jwt.roles);
            setId(body.user.id);
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

        <>
            <Navigation roles = {roles} />
            <Container maxWidth="md">
                <Switch>
                    <Route path='/' exact>
                        <ProtegerPage>
                            <Home/>
                        </ProtegerPage>
                    </Route>
                    <Route
                        path='/company/createSurvey'
                        render={(routeProps) => {
                            return <CreateSurvey
                                {...routeProps}
                                id = {id}
                            />
                        }}
                    >
                    </Route>
                    <Route
                        path="/survey/:id"
                        render={(routeProps) => {
                            return <Survey
                                {...routeProps}
                            />
                        }}
                    >
                    </Route>
                    <Route
                        path="/edit/survey/:id"
                        render={(routeProps) => {
                            return <SurveyEdit
                                {...routeProps}
                            />
                        }}
                    >
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
                    <Route
                        path='/surveys'
                        render={(routeProps) => {
                            return <SurveyList
                                {...routeProps}
                            />
                        }}
                    >
                    </Route>

                    <Route path='/ranking'>
                        <h1>Classements</h1>
                    </Route>
                    <Route path='/register'>
                        <Register/>
                    </Route>
                    <Route path='/*'>
                        <NotFound/>
                    </Route>
                </Switch>
            </Container>
        </>
    );
}
const AppWithRouteProps = withRouter(App);
ReactDOM.render(<Router><AppWithRouteProps/></Router>, document.getElementById('root'));