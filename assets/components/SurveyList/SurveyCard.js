import {
  Button,
  Card,
  CardActions,
  CardContent, Chip,
  Stack, TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { SurveyStatus } from "../SurveyStatus";
import React from "react";
import PropTypes from "prop-types";

SurveyCard.propTypes = {
  survey: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  toggleSurveyStatus: PropTypes.func.isRequired,
};

function getButtonTitle(status) {
  switch (status) {
    case "closed":
    case "waiting":
      return "ouvrir";
    case "opened":
      return "fermer";
  }
}

export function SurveyCard(props) {
  let emailsRef = React.useRef(null);
  const [emails, setEmails] = React.useState([]);

  function handleOnSubmit(event) {
    event.preventDefault();
    console.log(emailsRef.current.value);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      setEmails(prevEmails => prevEmails.concat(emailsRef.current.value));
      emailsRef.current.value = "";
    }
  }

  function handleDelete(indexDeLEmailQuonveuteffacer) {
    setEmails(emails.filter((email, indexDeLEmail) => indexDeLEmail !== indexDeLEmailQuonveuteffacer));
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <Card sx={{ minWidth: 275 }}>
        <Link
          to={"/survey/" + props.survey.id}
          style={{
            textDecoration: "none",
            color: "#333333",
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <SurveyStatus status={props.survey.status} />
              <Typography variant="h5" gutterBottom>
                {props.survey.title}
              </Typography>
            </Stack>
          </CardContent>
        </Link>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            {emails.map((email, index) => {
              return <Chip key={index} label={email} onDelete={() => handleDelete(index)}/>
            })}
          </Stack>
          <TextField
            aria-label="emails"
            label="Entrez des emails"
            multiline
            inputRef={emailsRef}
            fullWidth
            onKeyPress={handleKeyPress}
          />
        </Stack>
        <CardActions>
          <Button onClick={props.toggleSurveyStatus} size="small">
            {getButtonTitle(props.survey.status)}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
