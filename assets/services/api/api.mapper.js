export function mapToSurveyApi(param) {
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