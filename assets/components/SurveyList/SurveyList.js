import React from "react";
import PropTypes from "prop-types";
import {SurveyCard} from "./SurveyCard";

SurveyList.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export function SurveyList(props) {
    const [surveyList, setSurveyList] = React.useState(null);
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

    function toggleSurveyStatus(id, status) {
        console.log(id, status);
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
        </div>
    )
}