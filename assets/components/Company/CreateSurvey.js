import React from 'react';

export function CreateSurvey() {
    function handleOnSubmit(event) {
        event.preventDefault();
    }

    return <form onSubmit={handleOnSubmit}>
        <input type="text"/>
        <textarea title="description" cols="30" rows="10"></textarea>
        <button type="submit">Créer le sondage</button>
    </form>
}