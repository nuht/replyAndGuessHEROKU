/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import ReactDOM from "react-dom";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";

// any CSS you import will output into a single css file (toto in this case)
import "./main.css";

// start the Stimulus application
import "./bootstrap";
import "normalize-css";
import { Navigation } from "./components/Navigation/Navigation";
import { Register } from "./components/Register";
import { Login } from "./components/Login/Login";
import { CreateSurvey } from "./components/Company/CreateSurvey";
import { Container } from "@mui/material";
import { NotFound } from "./components/NotFound";
import { Survey } from "./components/Survey/Survey";
import PropTypes from "prop-types";
import { SurveyList } from "./components/SurveyList/SurveyList";
import { UserContext } from "./user-context";
import {
  HydraAdmin,
  AdminGuesser,
  hydraDataProvider,
  hydraSchemaAnalyzer,
} from "@api-platform/admin";
import { SurveyAnswer } from "./components/Survey/SurveyAnswer";

App.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

/*const user = {
  id : "",
  email: "",
  company_id: "",
  roles: ""
};*/

function App(props) {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    if (localStorage.getItem("logged_in") === "true") {
      getAndSetUserRoles();
    }
  }, []);

  function getAndSetUserRoles() {
    fetch(`${process.env.API_URL}/api/me`)
      .then((response) => {
        if (response.status === 401) {
          props.history.push("/login");
        }

        return response.json();
      })
      .then((body) => {
        setUser({
          id: body.user.id,
          email: body.user.email,
          companyId: body.user.company.id,
          roles: body.user.role,
        });
      });
  }

  function handleAddItem() {
    const isLoggedIn = localStorage.getItem("logged_in");

    if (isLoggedIn) {
      getAndSetUserRoles();
    }
  }

  React.useEffect(() => {
    window.addEventListener("addItem", handleAddItem);
    return () => {
      window.removeEventListener("addItem", handleAddItem);
    };
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Navigation roles={user && user.roles ? user.roles : []} />
      <Container maxWidth="md">
        <Switch>
          <Route path={["/", "/surveys"]} exact component={SurveyList} />
          <Route path="/company/createSurvey" component={CreateSurvey} />
          <Route path="/answerSurvey" exact component={SurveyAnswer} />
          <Route path="/survey/:id" exact component={Survey} />
          <Route path="/login" exact component={Login} />;
          <Route path="/questions">
            <h1>Liste des questions</h1>
          </Route>
          <Route path="/ranking">
            <h1>Classements</h1>
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/*">
            <NotFound />
          </Route>
        </Switch>
      </Container>
    </UserContext.Provider>
  );
}
const AppWithRouteProps = withRouter(App);
ReactDOM.render(
  <Router>
    <AppWithRouteProps />
  </Router>,
  document.getElementById("root")
);
