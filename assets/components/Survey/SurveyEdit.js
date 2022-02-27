import PropTypes from "prop-types";
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
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ChoicesTypes,
  QuestionTypes,
} from "../../utils/formValidation/types";
import { SurveyLayout } from "./style";
import { useUserContext } from "../../user-context";
import { formValidation } from "../../utils/formValidation/surveyValidation";
import { mapToSurveyApiForSurveyEdition } from "../../utils/api/api.mapper";

SurveyEdit.propTypes = {
  survey: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    questions: PropTypes.array,
  }).isRequired,
};

export function SurveyEdit(props) {
  const { survey } = props;
  const currentUser = useUserContext();
  let titleRef = React.useRef(null);
  let descriptionRef = React.useRef(null);
  const [info, setInfo] = React.useState("");
  const [questionList, setQuestionList] = React.useState(survey.questions);
  const [formErrors, setFormErrors] = React.useState({});

  function handleOnSubmit(event) {
    event.preventDefault();

    let formValidationResult = formValidation(
      titleRef.current.value,
      descriptionRef.current.value,
      questionList
    );

    if (formValidationResult.valid === false) {
      setFormErrors(formValidationResult.errors);
      return;
    }

    fetch(`${process.env.API_URL}/api/surveys/${survey.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify(
        mapToSurveyApiForSurveyEdition({
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          company: currentUser.companyId,
          questionList,
        })
      ),
    });
  }

  function handleAddQuestion() {
    setQuestionList((previousQuestionList) => {
      return [
        ...previousQuestionList,
        {
          text: "",
          isRequired: false,
          choices: [],
          choicesType: ChoicesTypes.CHECKBOX,
          type: QuestionTypes.OUVERTE,
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
            choices: [...question.choices, ""],
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
              if (i === indexChoice) {
                return value;
              }
              return choice;
            }),
          };
        }
        return question;
      });
    });
  }

  function handleDeleteQuestion(index) {
    setQuestionList((previousQuestionList) => {
      return [
        ...previousQuestionList.slice(0, index),
        ...previousQuestionList.slice(index + 1),
      ];
    });
  }

  return (
    <SurveyLayout>
      {info}
      <form onSubmit={handleOnSubmit}>
        <Stack spacing={1}>
          {formErrors.title && (
            <Alert severity="error">{formErrors.title}</Alert>
          )}
          <TextField
            error={!!formErrors.title}
            inputRef={titleRef}
            label="Entrez un titre"
            defaultValue={survey.title}
          />
          {formErrors.description && (
            <Alert severity="error">{formErrors.description}</Alert>
          )}
          <TextField
            error={!!formErrors.description}
            aria-label="modifier description sondage"
            maxRows="10"
            minRows="4"
            inputRef={descriptionRef}
            label="Entrez une description"
            multiline
            defaultValue={survey.description}
          />
          <Stack spacing={3}>
            {questionList.map((question, index) => {
              return (
                <Card
                  sx={{ padding: "10px 20px", position: "relative" }}
                  key={`${index}`}
                >
                  <IconButton
                    color={"primary"}
                    sx={{ position: "absolute", right: 0, top: 0 }}
                    aria-label="delete"
                    onClick={() => {
                      handleDeleteQuestion(index);
                    }}
                  >
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
                    <FormControlLabel
                      value={QuestionTypes.OUVERTE}
                      control={<Radio />}
                      label="Question ouverte"
                    />
                    <FormControlLabel
                      value={QuestionTypes.CHOIX_MULTIPLE}
                      control={<Radio />}
                      label="Question à choix multiple"
                    />
                  </RadioGroup>
                  <Stack spacing={2}>
                    {formErrors.questions && formErrors.questions[index] && (
                      <Alert severity="error">
                        {formErrors.questions[index]}
                      </Alert>
                    )}
                    <TextField
                      error={
                        formErrors.questions && !!formErrors.questions[index]
                      }
                      fullWidth
                      label="Entrez la question"
                      value={question.text}
                      onChange={(event) =>
                        handleChangeOnQuestion(
                          "text",
                          index,
                          event.target.value
                        )
                      }
                      type="text"
                    />
                    <Stack direction={"row"}>
                      <FormControlLabel
                        sx={{ userSelect: "none" }}
                        control={
                          <Checkbox
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
                          />
                        }
                        label="Rendre la question obligatoire"
                      />

                      {question.type === QuestionTypes.CHOIX_MULTIPLE && (
                        <RadioGroup
                          aria-label="type"
                          name="radio-buttons-group"
                          value={question.choicesType}
                          onChange={(event, value) => {
                            handleChangeOnQuestion("choicesType", index, value);
                          }}
                        >
                          <Stack direction={"row"}>
                            <FormControlLabel
                              value={ChoicesTypes.CHECKBOX}
                              control={<Radio />}
                              label={ChoicesTypes.CHECKBOX}
                            />
                            <FormControlLabel
                              value={ChoicesTypes.RADIO}
                              control={<Radio />}
                              label={ChoicesTypes.RADIO}
                            />
                          </Stack>
                        </RadioGroup>
                      )}
                    </Stack>

                    {question.type === QuestionTypes.CHOIX_MULTIPLE && (
                      <>
                        {question.choices.map((choice, indexChoice) => {
                          return (
                            <Stack spacing={2} key={`choice.${indexChoice}`}>
                              {formErrors.choices &&
                                formErrors.choices[
                                  `${index}.${indexChoice}`
                                ] && (
                                  <Alert severity="error">
                                    {
                                      formErrors.choices[
                                        `${index}.${indexChoice}`
                                      ]
                                    }
                                  </Alert>
                                )}
                              <TextField
                                error={
                                  formErrors.choices &&
                                  !!formErrors.choices[
                                    `${index}.${indexChoice}`
                                  ]
                                }
                                fullWidth
                                label="Entrez le choix"
                                value={choice}
                                type="text"
                                onChange={(event) => {
                                  handleChangeOnChoice(
                                    index,
                                    indexChoice,
                                    event.target.value
                                  );
                                }}
                              />
                            </Stack>
                          );
                        })}
                        <Button
                          variant="outlined"
                          onClick={() => {
                            handleAddChoice(index);
                          }}
                        >
                          Ajouter un choix
                        </Button>
                      </>
                    )}
                  </Stack>
                </Card>
              );
            })}
            <Stack spacing={1}>
              <Button variant="outlined" onClick={handleAddQuestion}>
                Ajouter une question
              </Button>
              <Button variant="contained" type="submit">
                Editer le sondage
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </SurveyLayout>
  );
}
