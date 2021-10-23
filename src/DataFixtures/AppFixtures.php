<?php

namespace App\DataFixtures;

use App\Entity\Choice;
use App\Entity\Company;
use App\Entity\Multiple;
use App\Entity\Question;
use App\Entity\Survey;
use App\Entity\TextArea;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture implements FixtureInterface
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
            $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager)
    {
        //  php bin/console doctrine:fixtures:load

        /*foreach ($questions as $question) {
            $element = new Question();
            $element->setText($question[0]);
            $element->setProp1($question[1]);
            $element->setProp2($question[2]);
            $manager->persist($element);
            //sleep(20);
        }*/

        $users = [
            ['Quentin@gmail.com', 'passwordQuentin'],
            ['Joseph@gmail.com', 'passwordJoseph'],
            ['Henry@gmail.com', 'passwordHenry'],
            ['Thierry@gmail.com', 'passwordThierry'],
            ['Sophie@gmail.com', 'passwordSophie'],
            ['Kévin@gmail.com', 'passwordKévin'],
            ['Nathalie@gmail.com', 'passwordNathalie'],
            ['Odile@gmail.com', 'passwordOdile'],
            ['Myriam@gmail.com', 'passwordMyriam'],
            ['Clarisse@gmail.com', 'passwordClarisse']
        ];

        $company = new Company();
        $company->setName('Food truck Argentin');
        $manager->persist($company);
        $manager->flush();

        /** @var Company $company */
        $company = $manager->getRepository(Company::class)->findBy(['name' => 'Food truck Argentin']);

        $userAdmin = new User();
        $userAdmin->setCompany($company[0]);
        $userAdmin->setEmail('admin@admin.fr');
        $password = $this->passwordHasher->hashPassword($userAdmin, 'admin');
        $userAdmin->setPassword($password);
        $userAdmin->setGender(false);
        $userAdmin->setIsPending(false);
        $userAdmin->setBirthdate(new \DateTime('1993-05-08', new \DateTimeZone('Europe/Paris')));
        $userAdmin->setRoles(['ROLE_COMPANY']);

        $manager->persist($userAdmin);
        $manager->flush();

        $survey = new Survey();
        $survey->setTitle('Etude de marché food truck Argentin');
        $survey->setDescription("Bonjour,

Le questionnaire auquel vous allez participer a été créé dans le cadre d’un projet de création d’entreprise. Nous vous invitons à répondre le plus sérieusement possible aux questions qui vont vous être posées.

Vos réponses ne seront traitées qu’à des fins statistiques et ce de manière totalement anonyme.

Merci d’avance pour votre aide.");

        $survey->setUser($userAdmin);
        $manager->persist($survey);
        $manager->flush();

        $arrayQuestion = [
            0 => [
                'text' => 'À quelle fréquence allez-vous au restaurant ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Plusieurs fois par semaine',
                    '1 fois par semaine',
                    'Quelques fois par mois',
                    '1 fois par trimestre',
                    'Plus rarement',
                    'Jamais'
                ]
            ],
            1 => [
                'text' => 'Êtes-vous régulièrement client de restauration ambulante (type food truck)',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Oui',
                    'Non'
                ]
            ],
            2 => [
                'text' => 'En général, à quel moment vous rendez-vous au restaurant ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'checkboxes',
                'choice' => [
                    'Le midi en semaine',
                    'Le soir en semaine',
                    'Le midi pendant les week-ends',
                    'Le soir pendant les week-ends'
                ]
            ],
            3 => [
                'text' => 'Quels sont vos principaux critères lors du choix d’un restaurant ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'checkboxes',
                'choice' => [
                    'La rapidité du service',
                    'Le prix',
                    'La quantité',
                    'Le choix ou le renouvellement de la carte',
                    'Le type de cuisine (italienne, américaine…)',
                    'La qualité gustative',
                    'La qualité et l’origine des ingrédients (fraicheur par exemple)',
                    'L’accès facile par rapport au lieu de travail ou d’habitation',
                    'La présence d’un parking',
                    'Le cadre agréable, le calme'
                ]
            ],
            4 => [
                'text' => 'Êtes-vous intéressé par ce projet ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Très intéressé',
                    'Plutôt intéressé',
                    'Plutôt pas intéressé',
                    'Pas du tout intéressé'
                ]
            ],
            5 => [
                'text' => 'Quel aspect vous intéresse le plus ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'La restauration',
                    'La vente de produits artisanaux',
                    'Le choix d’une cuisine utilisant des produits Bio et des producteurs locaux',
                    'Les trois'
                ]
            ],
            6 => [
                'text' => 'En général, aimez-vous tester de nouvelles cuisines (de pays différents) ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Oui, j’aime découvrir de nouveaux plats',
                    'Non, en général cela ne m’attire pas'
                ]
            ],
            7 => [
                'text' => 'Un système de fidélité serait-il pertinent pour ce food-truck ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Tout à fait',
                    'Plutôt oui',
                    'Plutôt non',
                    'Pas du tout'
                ]
            ],
            8 => [
                'text' => 'Avec qui pourriez-vous manger ce type de nourriture ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'checkboxes',
                'choice' => [
                    'Seul',
                    'En couple',
                    'En famille',
                    'Avec des amis',
                    'Avec des collègues'
                ]
            ],
            9 => [
                'text' => 'À quel moment de la journée essayerez-vous de manger à ce food-truck ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Le midi en semaine',
                    'Le soir en semaine',
                    'Le midi pendant les week-ends',
                    'Le soir pendant les week-ends'
                ]
            ],
            10 => [
                'text' => 'Quel prix seriez-vous prêt à payer pour ce type de nourriture ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Entre 4€ et 8€',
                    'Entre 9€ et 13€',
                    'Entre 14€ et 18€',
                    'Entre 19€ et 25€',
                    'Plus de 25€'
                ]
            ],
            11 => [
                'text' => 'Á quelle catégorie socio-professionnelle appartenez-vous ?',
                'is_required' => true,
                'question_type' => 'multiple',
                'type' => 'radio',
                'choice' => [
                    'Agriculteur',
                    'Artisan',
                    'Commerçant',
                    'Chef d’entreprise',
                    'Profession libérale',
                    'Cadre ou profession intellectuelle supérieure',
                    'Profession intermédiaire',
                    'Employé',
                    'Ouvrier',
                    'Retraité',
                    'Demandeur d’emploi',
                    'Homme ou Femme au foyer',
                    'Etudiant, lycéen',
                    'Autre'
                ]
            ]
        ];


        foreach ($arrayQuestion as $question) {
            $questionElement = new Question();
            $questionElement->setSurvey($survey);
            if($question['question_type'] === 'multiple') {
                $element = new Multiple();
                $questionElement->setMultiple($element);
                foreach ($question['choice'] as $choice) {
                    $choiceElement = new Choice();
                    $choiceElement->setMultiple($element);
                    $choiceElement->setPropertyName($choice);
                    $manager->persist($choiceElement);
                }
            }
            if($question['question_type'] === 'text_area') {
                $element = new TextArea();
                $questionElement->setTextArea($element);
            }
            $questionElement->setText($question['text']);
            $questionElement->setIsRequired($question['is_required']);
            $manager->persist($questionElement);
        }

        $manager->flush();

    }

    public function getOrder() {
        return 1;
    }
}
