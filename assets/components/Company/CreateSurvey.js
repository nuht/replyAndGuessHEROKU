import React from 'react';
import {Button, Checkbox, Container, inputClasses, Stack, TextareaAutosize, TextField} from "@mui/material";
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
    const[questionList, setQuestionList] = React.useState([]);

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
            props.history.push("/survey/" + body.id);
        }).catch(error => {});
    }

    function handleAddQuestion() {
        /*type, text, isRequired, json choices*/
        setQuestionList(previousQuestionList => {
            return [
                ...previousQuestionList,
                {
                    title: "",
                    type: "textarea",
                    isRequired: false
                }
            ];
        });
    }

    function handleChangeOnQuestion(key, index, value) {
        setQuestionList(previousQuestionList => {
            return previousQuestionList.map((question, questionIndex) => {
                if(questionIndex === index)
                {
                    return {
                        ...question,
                        [key]: value
                    }
                }
                return question;
            })
        });
    }

    return (<div>
        {info}
        <h1>Créer un sondage</h1>
        <form onSubmit={handleOnSubmit}>
            <Stack spacing={2}>
                <TextField inputRef={titleRef} label="Entrez un titre :"/>
                <TextareaAutosize
                    aria-label="modifier description sondage"
                    maxRows="10"
                    minRows="4"
                    ref={descriptionRef}
                    placeholder="Entrez une description"
                />
                <Button variant="outlined" onClick={handleAddQuestion}>Ajouter une question</Button>
                {questionList.map((question, index) => {
                    return <Container fixed key={`${index}`}>
                        <TextField value={question.title} onChange={(event) => handleChangeOnQuestion("title", index, event.target.value)} type="text"/>
                        <Checkbox checked={question.isRequired} onChange={(event) => handleChangeOnQuestion("isRequired", index, event.target.checked)} type="checkbox"/>
                    </Container>
                })}
                <Button variant="contained" type="submit">Créer le sondage</Button>
            </Stack>
        </form>
    </div>)
}