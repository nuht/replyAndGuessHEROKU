import React from "react";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel, Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import {SurveyLayout} from "../Survey/style";
import {useUserContext} from "../../user-context";

const QuestionTypes = {
  OUVERTE : "ouverte",
  CHOIX_MULTIPLE : "multiple"
};

CreateSurvey.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export function CreateSurvey(props) {
  const currentUser = useUserContext();
  let titleRef = React.useRef(null);
  let descriptionRef = React.useRef(null);
  const [info, setInfo] = React.useState("");
  const [questionList, setQuestionList] = React.useState([]);
  const [formErrors, setFormErrors] = React.useState({});

  function isFormValid() {
    let errors = {};
    if (titleRef.current.value === "") {
        errors.title = "Un titre doit être renseigné.";
    }
    if (descriptionRef.current.value === "") {
        errors.description = "Une description doit être renseignée.";
    }
    questionList.map((question, index) => {
      if(question.title === ""){
        if(errors.questions) {
          errors.questions[index] = `Un titre doit être renseigné sur la question ${index+1}`;
        } else {
          errors.questions = {};
          errors.questions[index] = `Un titre doit être renseigné sur la question ${index+1}`;
        }
      }
    });

    return {
      valid : Object.keys(errors).length === 0,
      errors
    };
  }

  function handleOnSubmit(event) {
    event.preventDefault();

    let formValidationResult = isFormValid();

    if (formValidationResult.valid === false) {
      setFormErrors(formValidationResult.errors);
      return;
    }

    fetch(`${process.env.API_URL}/api/surveys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        user: "api/users/" + currentUser.id,
        company: "api/companies/" + currentUser.companyId
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else setInfo("Le sondage n'a pas été crée erreur " + response.status);
      })
      .then((body) => {
        props.history.push("/survey/" + body.id);
      })
      .catch(() => {});
  }

  function handleAddQuestion() {
    /*type, text, isRequired, json choices*/
    setQuestionList((previousQuestionList) => {
      return [
        ...previousQuestionList,
        {
          title: "",
          type: QuestionTypes.OUVERTE,
          isRequired: false,
        },
      ];
    });
  }

  function handleChangeOnQuestion(key, index, value) {
    setQuestionList((previousQuestionList) => {
      return previousQuestionList.map((question, questionIndex) => {
        if (questionIndex === index) {
          return {
            ...question,
            [key]: value,
          };
        }
        return question;
      });
    });
  }

  function handleAddChoice() {

  }

  return (
    <SurveyLayout>
      {info}
      <form onSubmit={handleOnSubmit}>
        <Stack spacing={1}>
          {formErrors.title && <Alert severity="error">{formErrors.title}</Alert>}
          <TextField error={formErrors.title} inputRef={titleRef} label="Entrez un titre" />
          {formErrors.description && <Alert severity="error">{formErrors.description}</Alert>}
          <TextField
            aria-label="modifier description sondage"
            maxRows="10"
            minRows="4"
            ref={descriptionRef}
            label="Entrez une description"
            multiline
          />
          <Button variant="outlined" onClick={handleAddQuestion}>
            Ajouter une question
          </Button>
          {questionList.map((question, index) => {
            return (
              <div key={`${index}`}>
                <FormLabel component="legend">Type de question</FormLabel>
                <RadioGroup
                    aria-label="type de question"
                    name="radio-buttons-group"
                    value={question.type}
                    onChange={(event, value) => {
                      handleChangeOnQuestion("type", index, value);
                    }}
                >
                  <FormControlLabel value={QuestionTypes.OUVERTE} control={<Radio />} label="Question ouverte" />
                  <FormControlLabel value={QuestionTypes.CHOIX_MULTIPLE} control={<Radio />} label="Question à choix multiple" />
                </RadioGroup>

                {question.type === QuestionTypes.OUVERTE ? (
                    <>
                      <Stack spacing={2}>
                        {formErrors.questions && formErrors.questions[index] && <Alert severity="error">{formErrors.questions[index]}</Alert>}
                        <TextField
                            error={formErrors.questions}
                            fullWidth
                            label="Entrez la question"
                            value={question.title}
                            onChange={(event) =>
                                handleChangeOnQuestion("title", index, event.target.value)
                            }
                            type="text"
                        />
                      </Stack>
                      <FormGroup>
                        <FormControlLabel sx={{userSelect: "none"}} control={<Checkbox
                            id={`question.${index}`}
                            checked={question.isRequired}
                            onChange={(event) =>
                                handleChangeOnQuestion(
                                    "isRequired",
                                    index,
                                    event.target.checked
                                )
                            }
                            type="checkbox"
                        />} label="Rendre la question obligatoire" />
                      </FormGroup>
                    </>
                ) : (
                    <>
                      <Stack spacing={2}>
                        {formErrors.questions && formErrors.questions[index] && <Alert severity="error">{formErrors.questions[index]}</Alert>}
                        <TextField
                            error={formErrors.questions}
                            fullWidth
                            label="Entrez la question"
                            value={question.title}
                            onChange={(event) =>
                                handleChangeOnQuestion("title", index, event.target.value)
                            }
                            type="text"
                        />
                      </Stack>
                      <FormGroup>
                        <Stack direction="row">
                          <FormControlLabel sx={{userSelect: "none"}} control={<Checkbox
                              id={`question.${index}`}
                              checked={question.isRequired}
                              onChange={(event) =>
                                  handleChangeOnQuestion(
                                      "isRequired",
                                      index,
                                      event.target.checked
                                  )
                              }
                              type="checkbox"
                          />} label="Rendre la question obligatoire" />
                          <Button variant="outlined" onClick={handleAddChoice}>
                            Ajouter un choix
                          </Button>
                        </Stack>
                      </FormGroup>
                    </>
                )}
              </div>
            );
          })}
          <Button variant="contained" type="submit">
            Créer le sondage
          </Button>
        </Stack>
      </form>
    </SurveyLayout>
  );
}
