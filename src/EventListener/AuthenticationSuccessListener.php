<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;

class AuthenticationSuccessListener {

    private $ttl_token;
    private $ttl_refresh;
    private $em;

    public function __construct($ttl_token, $ttl_refresh, EntityManagerInterface $em)
    {
        $this->ttl_token = $ttl_token;
        $this->ttl_refresh = $ttl_refresh;
        $this->em = $em;
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event) {

        /** @var User $user */
        $user = $event->getUser();
        $user->setLastConnectionDate(new \DateTime('NOW', new \DateTimeZone('Europe/Paris')));
        $this->em->persist($user);
        $this->em->flush();

        $response = $event->getResponse();
        $data = $event->getData();

        $token = $data['token'];
        $refresh_token = $data['refresh_token'];
        unset($data['token']);
        unset($data['refresh_token']);
        $event->setData($data);

        $response->headers->setCookie(
            new Cookie(
                'BEARER',
                $token,
                (new \DateTime())->add(new \DateInterval('PT' . $this->ttl_token . 'S')),
                '/',
                null,
                false,
                true,
                false,
                'lax'
            )
        );

        $response->headers->setCookie(
            new Cookie(
                'REFRESH_TOKEN',
                $refresh_token,
                (new \DateTime())->add(new \DateInterval('PT' . $this->ttl_refresh . 'S')),
                '/',
                null,
                false,
                true,
                false,
                'lax'
            )
        );
    }
}