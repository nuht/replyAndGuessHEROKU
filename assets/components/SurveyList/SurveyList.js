import React from "react";
import PropTypes from "prop-types";
import {SurveyCard} from "./SurveyCard";
import {Alert, Snackbar} from "@mui/material";

SurveyList.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export function SurveyList(props) {
    const [surveyList, setSurveyList] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState(null);

    React.useEffect(()=> {
        fetch(`${process.env.API_URL}/api/surveys`).then((response) => {
            if(response.status === 401)
            {
                props.history.push("/login");
            }
            if(response.status === 404)
            {
                alert('Sondages introuvable');
            }

            return response.json();
        }).then(body => {
            setSurveyList(body['hydra:member']);
        });
    },[]);

    function getNextSurveyStatus(status) {
        switch (status) {
            case 'opened' :
                return 'closed';
            case 'closed' :
                return 'opened';
            case 'waiting' :
                return 'opened';
        }
    }

    function toggleSurveyStatus(id, status) {
        console.log(id, status);

        let nextSurveyStatus = getNextSurveyStatus(status);

        fetch(`${process.env.API_URL}/api/surveys/${id}`, {method: 'PUT', body: JSON.stringify({status : nextSurveyStatus}), headers: {"Content-Type" : "application/json"}}).then((response) => {
            if(response.status === 401)
            {
                props.history.push("/login");
            }
            if(response.status === 404)
            {
                alert('Sondage introuvable');
            }
            setAlertMessage(`Le sondage a bien été ${status === 'opened' ? 'fermé' : 'ouvert'}`);
            setShowAlert(true);
        })
    }

    return (
        <div>
            <h1>Survey List</h1>
            {surveyList !== null && <ul>{
                surveyList.map(survey => {
                    return <SurveyCard key={survey.id} survey={survey} toggleSurveyStatus={() => {
                        toggleSurveyStatus(survey.id, survey.status)
                    }}/>
                })
            }</ul>}
            <Snackbar open={showAlert} autoHideDuration={3000} onClose={() => setShowAlert(false)}>
                <Alert onClose={() => setShowAlert(false)} severity="success" sx={{ width: '100%' }}>
                    Le sondage a été {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}