import React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { mapSurveyApiToSurvey } from "../../domain/survey";
import {
  ChoicesTypes,
  QuestionTypes,
} from "../../services/formValidation/types";
import { SurveyLayout } from "./style";
import DeleteIcon from "@mui/icons-material/Delete";

SurveyAnswer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};
export function SurveyAnswer(props) {
  const [survey, setSurvey] = React.useState(null);
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
        setSurvey(mapSurveyApiToSurvey(body));
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

                    <Typography variant="body1" gutterBottom>
                      {question.text}
                    </Typography>
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
