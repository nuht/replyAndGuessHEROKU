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
  Snackbar,
} from "@mui/material";
import { mapSurveyApiToSurvey } from "../../domain/survey";
import {
  ChoicesTypes,
  QuestionTypes,
} from "../../services/formValidation/types";
import { SurveyLayout } from "./style";
import { red } from "@mui/material/colors";

SurveyAnswer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

function getMessageError(type) {
  if (type === QuestionTypes.CHOIX_MULTIPLE) {
    return "choix multiple";
  } else return "question ouverte";
}

export function SurveyAnswer(props) {
  const [survey, setSurvey] = React.useState(null);
  const [surveyResult, setSurveyResult] = React.useState({});
  const [formErrors, setFormErrors] = React.useState({});
  const [showAlert, setShowAlert] = React.useState(false);

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

  function handleSubmit() {
    let newErrors = {};
    for (const questionId in surveyResult) {
      if (surveyResult[questionId].isRequired) {
        if (
          Array.isArray(surveyResult[questionId].value) &&
          surveyResult[questionId].value.length === 0
        ) {
          newErrors[questionId] = true;
        } else {
          if (surveyResult[questionId].value === "") {
            newErrors[questionId] = true;
          }
        }
      }
      /*console.log(`${questionId}:`, surveyResult[questionId]);*/
    }

    /*Vérifier si l'objec new error a au moins une clé, si au moins une clé = invalide et il faut return pur court circuiter la fc et set formError*/
    if (Object.keys(newErrors).length > 0) {
      setShowAlert(true);
      console.log(formErrors);
      setFormErrors(newErrors);
      return;
    } else {
      setFormErrors({});
    }
  }

  function handleOnChangeOnToto(questionId, type, value) {
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
      <Snackbar
        open={showAlert}
        onClose={() => setShowAlert(false)}
        autoHideDuration={60000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="error"
          onClose={() => setShowAlert(false)}
          sx={{ width: "100%" }}
        >
          Il y a une erreur
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Typography variant="h4" gutterBottom>
            {survey.title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {survey.description}
          </Typography>
          <Stack spacing={3}>
            {survey.questions.map((question) => {
              return (
                <Card
                  sx={{
                    padding: "10px 20px",
                    position: "relative",
                    border: `2px solid`,
                    borderColor: formErrors[question.id]
                      ? red[50]
                      : "transparent",
                  }}
                  key={question.id}
                >
                  <Stack spacing={2}>
                    {formErrors[question.id] && (
                      <Alert severity="error">
                        {getMessageError(question.type)}
                      </Alert>
                    )}
                    <FormLabel required={question.isRequired}>
                      {question.text}
                    </FormLabel>
                    {question.type === QuestionTypes.OUVERTE && (
                      <TextField
                        error={
                          formErrors.questions &&
                          !!formErrors.questions[question.id]
                        }
                        maxRows="10"
                        minRows="4"
                        label="Entrez la réponse à la question"
                        multiline
                        value={surveyResult[question.id].value}
                        onChange={(event) =>
                          setSurveyResult((previousSurveyResult) => {
                            return {
                              ...previousSurveyResult,
                              [question.id]: {
                                ...previousSurveyResult[question.id],
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
