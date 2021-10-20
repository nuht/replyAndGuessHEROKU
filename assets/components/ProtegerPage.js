import React from "react";
import{Redirect} from "react-router-dom";

export function ProtegerPage(props) {

    function utilisateurEstIlConnecte() {
        return false;
    };

    if (utilisateurEstIlConnecte()) {
        return props.children;
    }

    return <Redirect to="/login" />

}