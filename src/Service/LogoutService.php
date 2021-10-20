<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class LogoutService {
    private $em;

    public function __construct(EntityManagerInterface $em) {
        $this->em = $em;
    }

    public function logout(Request $request, UserService $userService) {
        $refreshToken = $request->cookies->get('REFRESH_TOKEN');
        if($refreshToken !== null)
        {
            $conn = $this->em->getConnection();
            $sql = "DELETE FROM refresh_tokens WHERE refresh_token = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(1, $refreshToken);
            $stmt->executeStatement();
        }

        $response = new Response();

        $response->headers->setCookie(
            new Cookie(
                'BEARER',
                null,
                1,
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
                null,
                1,
                '/',
                null,
                false,
                true,
                false,
                'lax'
            )
        );

        return $response->send();
    }
}