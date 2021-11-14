import React from "react";
import PropTypes from "prop-types";
import {SurveyEdit} from "./SurveyEdit";
import {Button, CircularProgress} from "@mui/material";
import {SurveyStatus} from "../SurveyStatus";

Survey.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};
export function Survey(props) {
    const [survey, setSurvey] = React.useState(null);
    const [modeEdition, setModeEdition] = React.useState(false);
    React.useEffect(()=> {
        fetch(`${process.env.API_URL}/api/surveys/` + props.match.params.id).then((response) => {
            if(response.status === 401)
            {
                props.history.push("/login");
            }
            if(response.status === 404)
            {
                alert('Sondage introuvable');
            }


            return response.json();
        }).then(body => {
            console.log(body);
            setSurvey({
                title: body.title,
                description: body.description,
                status: body.status
            });
        });
    },[]);

    if(survey === null)
    {
        return <CircularProgress />
    }

    return (
        <div>
            <Button onClick={() => setModeEdition(!modeEdition)}>{modeEdition ? "Sortir du mode édition" : "Editer"}</Button>
            <h1>Survey : {props.match.params.id}<SurveyStatus status={survey.status}/></h1>
            {modeEdition ? <SurveyEdit survey={survey}/> : (
                <div>
                    <p>{survey.title}</p>
                    <p>{survey.description}</p>
                </div>
            )}
        </div>
    )
}