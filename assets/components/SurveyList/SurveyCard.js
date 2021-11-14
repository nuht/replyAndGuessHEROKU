import {Button, Card, CardActions, CardContent, Stack, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {SurveyStatus} from "../SurveyStatus";
import React from "react";
import PropTypes from "prop-types";

SurveyCard.propTypes = {
    survey: PropTypes.shape({
        id:PropTypes.number,
        status:PropTypes.string,
        title:PropTypes.string,
    }).isRequired,
    toggleSurveyStatus: PropTypes.func.isRequired
}

export function SurveyCard(props) {
    return (
        <Card sx={{minWidth: 275}}>
            <Link to={"/survey/" + props.survey.id} style={{
                textDecoration: 'none',
                color: '#333333'
            }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <SurveyStatus status={props.survey.status}/>
                        <Typography variant="h5" gutterBottom>
                            {props.survey.title}
                        </Typography>
                    </Stack>
                </CardContent>
            </Link>
            <CardActions>
                <Button onClick={props.toggleSurveyStatus}
                        size="small">{props.survey.status === 'waiting' ? 'Activer' : 'Désactiver'}</Button>
            </CardActions>
        </Card>
    )
}