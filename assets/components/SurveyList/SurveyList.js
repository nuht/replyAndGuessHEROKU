import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {SurveyStatus} from "../SurveyStatus";
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
            console.log(body);
            setSurveyList(body['hydra:member']);
        });
    },[]);

    return (
        <div>
            <h1>Survey List</h1>
            {surveyList !== null && <ul>{
                surveyList.map(survey => {
                    return <li key = {survey.id}>
                        <SurveyStatus status={survey.status} />
                        <Link to={"/survey/" + survey.id}>{survey.title}</Link>
                    </li>
                })
            }</ul>}
        </div>
    )
}