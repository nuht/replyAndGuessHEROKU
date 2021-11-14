import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {SurveyStatus} from "../SurveyStatus";
import {Button, Card, CardActions, CardContent, Typography, Stack} from "@mui/material";
SurveyList.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

SurveyCard.propTypes = {
    survey: PropTypes.object.isRequired,
    toggleSurveyStatus: PropTypes.func.isRequired
}

export function SurveyCard(props) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <Link to={"/survey/" + props.survey.id} style={{
                textDecoration: 'none',
                color: '#333'
            }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <SurveyStatus status={props.survey.status} />
                        <Typography variant="h5" gutterBottom>
                            {props.survey.title}
                        </Typography>
                    </Stack>
                </CardContent>
            </Link>
            <CardActions>
                <Button onClick={props.toggleSurveyStatus} size="small">{props.survey.status === 'waiting' ? 'Activer' : 'Désactiver'}</Button>
            </CardActions>
        </Card>
    )
}

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