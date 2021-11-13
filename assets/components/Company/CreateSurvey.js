import React from 'react';
import {Button, Stack, TextareaAutosize, TextField} from "@mui/material";
import PropTypes from "prop-types";
CreateSurvey.propTypes = {
    id: PropTypes.number,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

export function CreateSurvey(props) {
    let titleRef = React.useRef(null);
    let descriptionRef = React.useRef(null);
    const[info, setInfo] = React.useState("");

    function handleOnSubmit(event) {
        event.preventDefault();

        fetch(`${process.env.API_URL}/api/surveys`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "title": titleRef.current.value,
                "description": descriptionRef.current.value,
                "user": "api/users/" + props.id
            })
        }).then(response => {
            if(response.status === 201)
            {
                return response.json();
            } else setInfo("Le sondage n'a pas été crée erreur " + response.status)
        }).then(body => {
            props.history.push("edit/survey/" + body.id);
        }).catch(error => {});
    }

    return (<div>
        {info}
        <h1>Créer un sondage</h1>
        <form onSubmit={handleOnSubmit}>
            <Stack spacing={2}>
                <TextField inputRef={titleRef} id="outlined-basic" label="Entrez un titre :" variant="outlined" />
                <TextareaAutosize
                    aria-label="empty textarea"
                    maxRows="10"
                    minRows="4"
                    id="description"
                    ref={descriptionRef}
                    placeholder="Entrez une description"
                />
                <Button variant="contained" type="submit">Créer le sondage</Button>
            </Stack>
        </form>
    </div>)
}