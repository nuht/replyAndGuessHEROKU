import React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { mapSurveyApiToSurvey } from "../../utils/domain/survey";
import {
  ChoicesTypes,
  QuestionTypes,
} from "../../utils/formValidation/types";
import { SurveyLayout } from "./style";
import { red } from "@mui/material/colors";
import { mapToResultApiForSurveyAnswering } from "../../utils/api/api.mapper";

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

export function SurveyAnswer() {
  const [survey, setSurvey] = React.useState(null);
  const [userIri, setUserIri] = React.useState(null);
  const [surveyResult, setSurveyResult] = React.useState({});
  const [formErrors, setFormErrors] = React.useState({});
  const [showAlert, setShowAlert] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userHash = queryParams.get("userHash");
    const surveyHash = queryParams.get("surveyHash");

    fetch(`${process.env.API_URL}/api/answer_survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userHash: userHash,
        surveyHash: surveyHash,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          return Promise.reject(response);
        } else {
          return response.json();
        }
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
      })
      .catch((error) => {
        if (error instanceof Response) {
          error.json().then((body) => {
            setError(body);
          });
        }
      });

    fetch(`${process.env.API_URL}/api/get_user_iri`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userHash: userHash,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        setUserIri(body);
      });
  }, []);

  if (survey === null) {
    return <h2>{error}</h2>;
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
    }

    if (Object.keys(newErrors).length > 0) {
      setShowAlert(true);
      setFormErrors(newErrors);
      return;
    } else {
      setFormErrors({});

      fetch(`${process.env.API_URL}/api/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          mapToResultApiForSurveyAnswering({
            surveyAnswered: surveyResult,
            survey,
            userId: userIri,
          })
        ),
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } else {
          }
        })
        .catch(() => {});
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
