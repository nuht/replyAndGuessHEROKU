import React from "react";
import PropTypes from "prop-types";

SurveyStatus.propTypes = {
    status: PropTypes.string
}

export function SurveyStatus(props) {

    function getStatusColor(status) {
        console.log(status);
        if (status === 'waiting') {
            return 'yellow';
        }
        return 'black';
    }

    return <div style={{
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        backgroundColor: getStatusColor(props.status)
    }}></div>
}