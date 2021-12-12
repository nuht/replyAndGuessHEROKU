export function mapToSurveyApi(param) {
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
        type: question.type,
      };
    }),
  };
}

export function mapToEditSurveyApi(param) {
  return {
    title: param.title,
    description: param.description,
    company: "api/companies/" + param.company,
    questions: param.questionList.map((question) => {
      return {
        ...(question.id && { "@id": question.uri }),
        text: question.text,
        isRequired: question.isRequired,
        choices: question.choices,
        choicesType: question.choicesType,
        type: question.type,
      };
    }),
  };
}
