import {QuestionTypes} from "../../services/formValidation/types";

export function isFormValid(title, description, questionList) {

    let errors = {};

    if (title === "") {
        errors.title = "Un titre doit être renseigné.";
    }
    if (description === "") {
        errors.description = "Une description doit être renseignée.";
    }
    questionList.forEach((question, index) => {
        if (question.text === "") {
            errors.questions = {};
            errors.questions[index] = {
                title: `Un titre doit être renseigné sur la question ${index + 1}`
            };
        }
        if (question.type === QuestionTypes.CHOIX_MULTIPLE) {
            question.choices.forEach((choice, indexChoice) => {
                if (choice === "") {
                    if(errors.questions[index] && errors.questions[index].choices) {
                        errors.questions[index].choices[indexChoice] = "Un choix doit être renseigné";
                    } else {
                        if(!errors.questions[index]) {
                            errors.questions[index] = {};
                        }
                        if(!errors.questions[index].choices) {
                            errors.questions[index].choices = {};
                        }
                        errors.questions[index].choices[indexChoice] = "Un choix doit être renseigné";
                    }
                }
            });
        }
    });

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}