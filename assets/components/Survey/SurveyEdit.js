import PropTypes from "prop-types";
import React from "react";
import {Button} from "@mui/material";

SurveyEdit.propTypes = {
    survey: PropTypes.shape({
        id:PropTypes.number,
        status:PropTypes.string,
        title:PropTypes.string,
        description:PropTypes.string
    }).isRequired
};

export function SurveyEdit(props) {
    const {survey} = props;
    const titleInputRef = React.useRef(null);
    const descriptionInputRef = React.useRef(null);

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
            <form onSubmit={handleOnSubmit}>
                <label htmlFor="title">Titre :</label>
                <input ref={titleInputRef} id="title" type="text" name="title"/>

                <label htmlFor="description">Description :</label>
                <input ref={descriptionInputRef} id="description" type="text" name="description"/>

                <Button variant="contained" type="submit">Sauvegarder</Button>
            </form>
        </div>
    )
}