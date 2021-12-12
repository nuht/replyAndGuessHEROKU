import React from "react";
import PropTypes from "prop-types";
import { SurveyEdit } from "./SurveyEdit";
import { Button, CircularProgress } from "@mui/material";
import { SurveyStatus } from "../SurveyStatus";
import { mapSurveyApiToSurvey } from "../../domain/survey";

Survey.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
export function Survey(props) {
  const [survey, setSurvey] = React.useState(null);
  const [modeEdition, setModeEdition] = React.useState(false);
  React.useEffect(() => {
    fetch(`${process.env.API_URL}/api/surveys/` + props.match.params.id)
      .then((response) => {
        if (response.status === 401) {
          props.history.push("/login");
        }
        if (response.status === 404) {
          alert("Sondage introuvable");
        }

        return response.json();
      })
      .then((body) => {
        setSurvey(mapSurveyApiToSurvey(body));
      });
  }, []);

  if (survey === null) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Button onClick={() => setModeEdition(!modeEdition)}>
        {modeEdition ? "Sortir du mode édition" : "Editer"}
      </Button>
      <h1>
        Survey : {props.match.params.id}
        <SurveyStatus status={survey.status} />
      </h1>
      {modeEdition ? (
        <SurveyEdit survey={survey} />
      ) : (
        <div>
          <p>{survey.title}</p>
          <p>{survey.description}</p>
          <ul>
            {survey.questions.map((question) => {
              if (question.multiple) {
                return (
                  <li key={question.id}>
                    <p>{question.multiple.type}</p>
                    <ul>
                      {question.multiple.choices.map((choice) => {
                        return (
                          <li key={choice.propertyName}>
                            {choice.propertyName}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
