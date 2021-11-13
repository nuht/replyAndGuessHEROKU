import PropTypes from "prop-types";
import React from "react";
import {SurveyStatus} from "../SurveyStatus";
import {Button} from "@mui/material";

export function SurveyEdit(props) {

    const titleInputRef = React.useRef(null);
    const descriptionInputRef = React.useRef(null);
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
            setSurvey({
                title: body.title,
                description: body.description,
                status: body.status
            });
        });
    },[]);

    React.useEffect(() => {
        if(survey !== null) {
            titleInputRef.current.value = survey.title;
            descriptionInputRef.current.value = survey.description;
        }
    }, [survey])


    function handleOnSubmit(event) {
        event.preventDefault();
        console.log({
            title:titleInputRef.current.value,
            description:descriptionInputRef.current.value,
        });

        /*Fetch méthode put
        * Bouton ajouter une question et si on ajoute une question on modifie l'objet envoyé
        * */
    }

    return (
        <div>
            <h1>Survey : {props.match.params.id} {survey !== null && <SurveyStatus status={survey.status} />}</h1>
            {survey !== null && <form onSubmit={handleOnSubmit}>
                <label htmlFor="title">Titre :</label>
                <input ref={titleInputRef} id="title" type="text" name="title"/>

                <label htmlFor="description">Description :</label>
                <input ref={descriptionInputRef}id="description" type="text" name="description"/>

                <Button variant="contained" type="submit">Sauvegarder</Button>
            </form>}
        </div>
    )
}

SurveyEdit.propTypes = {
    match: PropTypes.any,
    location: PropTypes.any,
    history: PropTypes.any,
    staticContext: PropTypes.any
};