import React from "react";
import styled from "styled-components";

function getStatusColor(status) {
    if (status === 'waiting') {
        return 'yellow';
    }
    if (status === 'opened') {
        return 'green';
    }
    return 'black';
}

export const SurveyStatus = styled.div`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: ${props => getStatusColor(props.status)};
`;