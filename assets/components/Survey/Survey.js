import React from "react";
import PropTypes from "prop-types";
Survey.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};
export function Survey(props) {
    return <h1>Survey </h1>;
}