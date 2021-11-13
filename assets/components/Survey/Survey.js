import React from "react";
import PropTypes from "prop-types";
import {SurveyStatus} from "../SurveyStatus";

Survey.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export function Survey(props) {
    const [survey, setSurvey] = React.useState(null);
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



    return (
        <div>
            <h1>Survey : {props.match.params.id}</h1>
            {survey !== null && <div>
                <p>{survey.title}</p>
                <SurveyStatus status={survey.status} />
                <p>{survey.description}</p>
                <p>{survey.status}</p>
            </div>}
        </div>
    )
}