export function mapSurveyApiToSurvey(surveyApi) {
  return {
    id: surveyApi.id,
    title: surveyApi.title,
    description: surveyApi.description,
    status: surveyApi.status,
    questions: surveyApi.questions.map((questionApi) => {
      return {
        uri: questionApi["@id"],
        id: questionApi.id,
        text: questionApi.text,
        isRequired: questionApi.isRequired,
        choices: questionApi.choices,
        choicesType: questionApi.choicesType,
        type: questionApi.type,
      };
    }),
  };
}
