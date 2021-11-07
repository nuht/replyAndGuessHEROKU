import React from 'react';
import {Button, Stack, TextareaAutosize, TextField} from "@mui/material";

export function CreateSurvey() {
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
                "user": "api/users/120"
            })
        }).then(response => {
            if(response.status === 201)
            {
                setInfo('Le sondage a été crée');
            } else setInfo("Le sondage n'a pas été crée erreur " + response.status)
        }).catch(error => {});
    }

    return (<div>
        {info}
        <h1>Créer un sondage</h1>
        <form onSubmit={handleOnSubmit}>
            <Stack spacing={2}>
                <TextField ref={titleRef} id="outlined-basic" label="Entrez un titre :" variant="outlined" />
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