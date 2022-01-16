export function mapToSurveyApiForSurveyCreation(param) {
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

export function mapToSurveyApiForSurveyEdition(param) {
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

export function mapToResultApiForSurveyAnswering(param) {
  return {
    value: Object.entries(param.surveyAnswered).map((entry) => {
      const [questionId, question] = entry;
      const questionSurvey = param.survey.questions.find((q) => {
        /*@note synchroniser les deux types
         * Tester pour choix multiple*/
        return q.id == questionId;
      });
      return {
        text: questionSurvey.text,
        value: Array.isArray(question.value)
          ? question.value.join("::")
          : question.value,
        type: questionSurvey.type,
      };
    }),
    survey: `/api/surveys/${param.survey.id}`,
    user: param.userId,
  };
}
