import React from "react";
import PropTypes from "prop-types";
import {SurveyEdit} from "./SurveyEdit";
import {Button} from "@mui/material";
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

    function getStatusColor(status) {
        if(status === 'waiting')
        {
            return 'yellow';
        }
        return 'black';
    }

    if(survey === null)
    {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <Button onClick={() => setModeEdition(!modeEdition)}>{modeEdition ? "Sortir du mode édition" : "Editer"}</Button>
            <h1>Survey : {props.match.params.id}</h1>
            {modeEdition ? <SurveyEdit survey={survey}/> : (
                <div>
                    <p>{survey.title}</p> <div style={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(survey.status)
                    }}/>
                    <p>{survey.description}</p>
                    <p>{survey.status}</p>
                </div>
            )}
        </div>
    )
}