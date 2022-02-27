import {
  Button,
  Card,
  CardActions,
  CardContent,
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
  return (
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
      <CardActions>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <Button onClick={props.toggleSurveyStatus} size="small">
          {getButtonTitle(props.survey.status)}
        </Button>
      </CardActions>
    </Card>
  );
}
