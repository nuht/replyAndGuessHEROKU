import {QuestionTypes} from "./types";

export function formValidation(title, description, questionList) {

    let errors = {};

    if (title === "") {
        errors.title = "Un titre doit être renseigné.";
    }
    if (description === "") {
        errors.description = "Une description doit être renseignée.";
    }
    questionList.forEach((question, index) => {
        if (question.text === "") {
            if(errors.questions) {
                errors.questions[index] = `Un titre doit être renseigné sur la question ${index + 1}`;
            } else {
                errors.questions = {};
                errors.questions[index] = `Un titre doit être renseigné sur la question ${index + 1}`;
            }
        }
        if (question.type === QuestionTypes.CHOIX_MULTIPLE) {
            question.choices.forEach((choice, indexChoice) => {
                if (choice === "") {
                    if(errors.choices) {
                        errors.choices[`${index}.${indexChoice}`] = "Un choix doit être renseigné";
                    } else {
                        errors.choices = {};
                        errors.choices[`${index}.${indexChoice}`] = "Un choix doit être renseigné";
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