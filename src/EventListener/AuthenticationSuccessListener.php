<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;

class AuthenticationSuccessListener {

    private $ttl_token;
    private $ttl_refresh;

    public function __construct($ttl_token, $ttl_refresh)
    {
        $this->ttl_token = $ttl_token;
        $this->ttl_refresh = $ttl_refresh;
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event) {
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