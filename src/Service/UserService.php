<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Request;

class UserService
{
    private $request;
    private $em;

    public function __construct(Request $request, ObjectManager $em)
    {
        $this->request = $request;
        $this->em = $em;
    }

    public function getUserDataFromJwt()
    {
        $cookies = $this->request->cookies;

        if($cookies->get('BEARER')) {
            $data = [];
            $jwt = json_decode(base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $cookies->get('BEARER'))[1]))));

            $userRepository = $this->em->getRepository(User::class);
            $user = $userRepository->findOneBy(['email' => $jwt->email]);
            $isValid = $user->getIsValid();
            if($isValid === false)
            {
                return false;
            }
            $data['jwt'] = $jwt;
            $data['user']['id'] = $user->getId();
            $userCompany = $user->getCompany();
            $data['user']['company']['id'] = $userCompany->getId();
            $data['user']['company']['name'] = $userCompany->getName();
            $data['user']['company']['picture'] = $userCompany->getPicture();
            $data['user']['email'] = $user->getEmail();
            $data['user']['role'] = $user->getRoles();
            $data['user']['gender'] = $user->getGender();
            $data['user']['isPending'] = $user->getIsPending();
            $data['user']['score'] = $user->getScore();
            $data['user']['registerDate'] = $user->getRegisterDate();
            $data['user']['lastUpdate'] = $user->getLastUpdate();
            $data['user']['lastConnectionDate'] = $user->getLastConnectionDate();
            $data['user']['birthdate'] = $user->getBirthDate();
            $data['user']['hash'] = $user->getHash();

            return $data;
        } else return false;
    }
}