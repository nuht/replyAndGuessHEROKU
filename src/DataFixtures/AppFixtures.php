<?php

namespace App\DataFixtures;

use App\Entity\Question;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private EntityManagerInterface $em;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
            $this->em = $entityManager;
            $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager, )
    {
        /*$dql = 'ALTER TABLE question AUTO_INCREMENT = 1';
        $query = $this->em->createQuery($dql);
        $query->execute();*/

        //  php bin/console doctrine:fixtures:load
        $questions =
        [
            ['Thé ou café ?', 'Thé', 'Café'],
            ['Pokémon ou Digimon', 'Pokémon', 'Digimon'],
            ['Film ou série ?', 'Film', 'Série'],
            ['Coca cola ou Pepsi ?', 'Coca Cola', 'Pepsi'],
            ['Manche courte ou longue ?', 'Courte', 'Longue'],
            ['Foot ou rugby ?', 'Foot', 'Rugby'],
            ['Fruit ou légumes ?', 'Fruits', 'légumes'],
            ['Sucré ou salé ?', 'Sucré', 'Salé'],
            ['Chocolat lait ou noir ?', 'Chocolat lait', 'Chocolat noir'],
            ['Livre papier ou sur tablette ?', 'Livre papier', 'Livre tablette'],
            ['Manga ou manhwa ?', 'Manga', 'Manhwa'],
            ['Bitcoin ou Ethereum ?', 'Bitcoin', 'Ethereum'],
            ['Ski ou snowboard ?', 'Ski', 'Snowboard'],
            ['Télétravail ou travail sur site ?', 'Télétravail', 'Travail sur site'],
            ['Chien ou chat ?', 'Chien', 'Chat'],
            ['Chaud ou froid ?', 'Chaud', 'Froid'],
            ['Chine ou USA ?', 'Chine', 'USA'],
            ['Kebab ou Panini ?', 'Kebab', 'Panini'],
            ['Macdo ou Burger King ?', 'Macdo', 'Burger King'],
            ['Jedi ou Sith ?', 'Jedi', 'Sith'],
        ];

        foreach ($questions as $question) {
            $element = new Question();
            $element->setText($question[0]);
            $element->setProp1($question[1]);
            $element->setProp2($question[2]);
            $manager->persist($element);
            //sleep(20);
        }

        $users = [
            ['Quentin@gmail.com', 'passwordQuentin', 'Quentin'],
            ['Joseph@gmail.com', 'passwordJoseph', 'Joseph'],
            ['Henry@gmail.com', 'passwordHenry', 'Henry'],
            ['Thierry@gmail.com', 'passwordThierry', 'Thierry'],
            ['Sophie@gmail.com', 'passwordSophie', 'Sophie'],
            ['Kévin@gmail.com', 'passwordKévin', 'Kévin'],
            ['Nathalie@gmail.com', 'passwordNathalie', 'Nathalie'],
            ['Odile@gmail.com', 'passwordOdile', 'Odile'],
            ['Myriam@gmail.com', 'passwordMyriam', 'Myriam'],
            ['Clarisse@gmail.com', 'passwordClarisse', 'Clarisse']
        ];

        foreach($users as $user) {
            $element = new User();
            $element->setEmail($user[0]);
            $password = $this->passwordHasher->hashPassword($element, $user[1]);
            $element->setPassword($password);
            $element->setUsername($user[2]);
            $manager->persist($element);
        }

        $manager->flush();
    }
}
