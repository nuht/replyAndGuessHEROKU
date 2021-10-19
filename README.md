# Projet

#### LANCER DES FIXTURES
`php bin/console doctrine:fixtures:load`



1 er endpoint a créer:
Première inscription donne le role company a l'utilisateur pour la company qu'il inscrit
Il invite d'autre user avec leur email
Création d'un compte utilisateur pour chaque email lié a la company de l'user qui invite
Envoi d'un email pour changer le mot de passe

2 er endpoint a créer:
Creation de survey sur la base de ma fixtures



3 créer un result
{
"value": [
"string"
],
"survey": "/api/surveys/11",
"valuePredict": [
"string"
],
"userId": "/api/users/108"
}

4 créer un sondage enregistrer direct
puis au fur et a mesure rajouter des questions

5 créer route /me et regarder sur l'user du cookie est l'user demandé