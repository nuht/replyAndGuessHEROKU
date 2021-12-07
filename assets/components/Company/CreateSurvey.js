import React from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";
import {SurveyLayout} from "../Survey/style";
import {useUserContext} from "../../user-context";

const QuestionTypes = {
  OUVERTE : "ouverte",
  CHOIX_MULTIPLE : "multiple"
};

const ChoicesTypes = {
  RADIO : "radio",
  CHECKBOX : "checkbox"
};

CreateSurvey.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

function mapToSurveyApi(param) {
  console.log(param);
  return {
    title: param.title,
    description: param.description,
    company: "api/companies/" + param.company,
    questions: param.questionList.map((question) => {
      return {
          text: question.text,
          isRequired: question.isRequired,
          choices: question.choices,
          choicesType: question.choicesType,
          type: question.type
        }
    })
  };
}

export function CreateSurvey(props) {
  const currentUser = useUserContext();
  let titleRef = React.useRef(null);
  let descriptionRef = React.useRef(null);
  const [info, setInfo] = React.useState("");
  const [questionList, setQuestionList] = React.useState([]);
  const [formErrors, setFormErrors] = React.useState({});

  /*@Todo Rajouter la partie validations des choices ou non parce qu'on peut mettre des string vide*/

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

    console.log(descriptionRef);
    console.log(titleRef.current.value);
    console.log(descriptionRef.current.value);

    fetch(`${process.env.API_URL}/api/surveys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mapToSurveyApi({
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        company: currentUser.companyId,
        questionList
      })),
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
          text: "",
          isRequired: false,
          choices: [],
          choicesType: ChoicesTypes.CHECKBOX,
          type: QuestionTypes.OUVERTE
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

  function handleAddChoice(index) {
    setQuestionList((previousQuestionList) => {
      return previousQuestionList.map((question, questionIndex) => {
        if (questionIndex === index) {
          return {
            ...question,
            choices: [
                ...question.choices,
                ""
            ],
          };
        }
        return question;
      });
    });
  }

  function handleChangeOnChoice(index, indexChoice, value) {
    setQuestionList((previousQuestionList) => {
      return previousQuestionList.map((question, questionIndex) => {
        if (questionIndex === index) {
          return {
            ...question,
            choices: question.choices.map((choice, i) => {
              if(i === indexChoice) {
                return value;
              }
              return choice;
            })

          };
        }
        return question;
      });
    });
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
            inputRef={descriptionRef}
            label="Entrez une description"
            multiline
          />
          <Stack spacing={3}>
            {questionList.map((question, index) => {
              return (
                  <Card sx={{padding: "10px 20px", position: "relative"}} key={`${index}`}>
                      <IconButton color={"primary"} sx={{position: "absolute", right: 0, top: 0}} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
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
                    <Stack spacing={2}>
                      {formErrors.questions && formErrors.questions[index] && <Alert severity="error">{formErrors.questions[index]}</Alert>}
                      <TextField
                          error={formErrors.questions}
                          fullWidth
                          label="Entrez la question"
                          value={question.text}
                          onChange={(event) =>
                              handleChangeOnQuestion("text", index, event.target.value)
                          }
                          type="text"
                      />
                      <Stack direction={"row"}>
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
                        <RadioGroup
                            aria-label="type"
                            name="radio-buttons-group"
                            value={question.choicesType}
                            onChange={(event, value) => {
                              handleChangeOnQuestion("choicesType", index, value);
                            }}
                        ><Stack direction={"row"}>
                          <FormControlLabel value={ChoicesTypes.CHECKBOX} control={<Radio />} label={ChoicesTypes.CHECKBOX} />
                          <FormControlLabel value={ChoicesTypes.RADIO} control={<Radio />} label={ChoicesTypes.RADIO} />
                        </Stack>
                        </RadioGroup>
                      </Stack>

                      {question.type === QuestionTypes.CHOIX_MULTIPLE &&
                          <>
                            <Stack direction="row">
                              {question.choices.map((choice, indexChoice) => {
                                return (
                                    <TextField
                                        fullWidth
                                        label="Entrez le choix"
                                        value={choice}
                                        type="text"
                                        key={`choice.${indexChoice}`}
                                        onChange={(event) => {
                                          handleChangeOnChoice(index, indexChoice, event.target.value);
                                        }}
                                    />
                                )
                              })}
                            </Stack>
                            <Button variant="outlined" onClick={() => {
                              handleAddChoice(index)
                            }
                            }>
                              Ajouter un choix
                            </Button>
                          </>
                      }
                    </Stack>
                  </Card>
              );
            })}
            <Stack spacing={1}>
              <Button variant="outlined" onClick={handleAddQuestion}>
                Ajouter une question
              </Button>
              <Button variant="contained" type="submit">
                Créer le sondage
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </SurveyLayout>
  );
}
