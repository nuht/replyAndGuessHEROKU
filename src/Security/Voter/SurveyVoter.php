<?php

namespace App\Security\Voter;

use App\Entity\Result;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use App\Entity\Survey;

class SurveyVoter extends Voter
{
    private $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    protected function supports(string $attribute, $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, ['CAN_ANSWER'])
            && ($subject instanceof Survey || $subject instanceof  Paginator);
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        $resultRepository = $this->em->getRepository(Result::class);
        $result = $resultRepository->findBy(['survey' => $subject->getId(), 'user' => $user->getId()]);

        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }


        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case 'CAN_ANSWER':
                if(sizeof($result) === 0) {
                    return true;
                }
        }

        return false;
    }
}
