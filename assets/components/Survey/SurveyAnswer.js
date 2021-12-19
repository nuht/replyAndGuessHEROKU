import React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormLabel,
} from "@mui/material";
import { mapSurveyApiToSurvey } from "../../domain/survey";
import {
  ChoicesTypes,
  QuestionTypes,
} from "../../services/formValidation/types";
import { SurveyLayout } from "./style";

SurveyAnswer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
export function SurveyAnswer(props) {
  const [survey, setSurvey] = React.useState(null);
  const [surveyResult, setSurveyResult] = React.useState({});
  const [formErrors, setFormErrors] = React.useState({});
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
        let s = mapSurveyApiToSurvey(body);
        setSurveyResult(() => {
          let newSurveyResult = {};
          s.questions.forEach((question) => {
            newSurveyResult[question.text] = {
              value: "",
              isRequired: question.isRequired,
            };
          });
          return newSurveyResult;
        });
        setSurvey(s);
      });
  }, []);

  if (survey === null) {
    return <CircularProgress />;
  }

  function handleSubmit() {}

  function handleOnSubmit() {}

  return (
    <SurveyLayout>
      <form onSubmit={handleOnSubmit}>
        <Stack spacing={1}>
          <Typography variant="h4" gutterBottom>
            {survey.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {survey.description}
          </Typography>
          <Stack spacing={3}>
            {survey.questions.map((question, index) => {
              console.log(question);
              return (
                <Card
                  sx={{ padding: "10px 20px", position: "relative" }}
                  key={`${index}`}
                >
                  <Stack spacing={2}>
                    {formErrors.questions && formErrors.questions[index] && (
                      <Alert severity="error">
                        {formErrors.questions[index]}
                      </Alert>
                    )}

                    <FormLabel required={question.isRequired}>
                      {question.text}
                    </FormLabel>
                    {question.type === QuestionTypes.OUVERTE && (
                      <TextField
                        error={
                          formErrors.questions && !!formErrors.questions[index]
                        }
                        maxRows="10"
                        minRows="4"
                        label="Entrez la réponse à la question"
                        multiline
                        value={surveyResult[question.text].value}
                        onChange={(event) =>
                          setSurveyResult((previousSurveyResult) => {
                            return {
                              ...previousSurveyResult,
                              [question.text]: {
                                ...previousSurveyResult[question.text],
                                value: event.target.value,
                              },
                            };
                          })
                        }
                      />
                    )}

                    {question.type === QuestionTypes.CHOIX_MULTIPLE && (
                      <RadioGroup>
                        {question.choices.map((choice, indexChoice) => (
                          <FormControlLabel
                            value={choice}
                            key={indexChoice}
                            control={
                              question.choicesType === ChoicesTypes.RADIO ? (
                                <Radio />
                              ) : (
                                <Checkbox />
                              )
                            }
                            label={choice}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        </Stack>
      </form>
      <Button onClick={() => handleSubmit()}>Soumettre le formulaire</Button>
    </SurveyLayout>
  );
}
