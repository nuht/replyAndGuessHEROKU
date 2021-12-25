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
            newSurveyResult[question.id] = {
              value:
                question.type === QuestionTypes.CHOIX_MULTIPLE &&
                question.choicesType === ChoicesTypes.CHECKBOX
                  ? []
                  : "",
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

  function handleOnChangeOnToto(questionId, type, value) {
    console.log(value);
    setSurveyResult((previousSurveyResult) => {
      let oldValue = previousSurveyResult[questionId].value;
      let newValue = value;
      if (type === ChoicesTypes.CHECKBOX) {
        if (oldValue.includes(newValue)) {
          let index = oldValue.findIndex((element) => element === newValue);

          newValue = [
            ...oldValue.slice(0, index),
            ...oldValue.slice(index + 1),
          ];
          console.log(index, newValue);
        } else {
          newValue = oldValue.concat([newValue]);
        }
      }

      return {
        ...previousSurveyResult,
        [questionId]: { ...previousSurveyResult[questionId], value: newValue },
      };
    });
  }

  return (
    <SurveyLayout>
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Typography variant="h4" gutterBottom>
            {survey.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {survey.description}
          </Typography>
          <Stack spacing={3}>
            {survey.questions.map((question, questionIndex) => {
              return (
                <Card
                  sx={{ padding: "10px 20px", position: "relative" }}
                  key={question.id}
                >
                  <Stack spacing={2}>
                    {formErrors.questions &&
                      formErrors.questions[questionIndex] && (
                        <Alert severity="error">
                          {formErrors.questions[questionIndex]}
                        </Alert>
                      )}

                    <FormLabel required={question.isRequired}>
                      {question.text}
                    </FormLabel>
                    {question.type === QuestionTypes.OUVERTE && (
                      <TextField
                        error={
                          formErrors.questions &&
                          !!formErrors.questions[questionIndex]
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
                              [question.text + questionIndex]: {
                                ...previousSurveyResult[
                                  question.text + questionIndex
                                ],
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
                            onChange={(event) => {
                              handleOnChangeOnToto(
                                question.id,
                                question.choicesType,
                                event.target.value
                              );
                            }}
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
