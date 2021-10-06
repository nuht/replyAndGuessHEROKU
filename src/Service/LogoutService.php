<?php

namespace App\Service;

use Doctrine\ORM\EntityManager;

class LogoutService {
    private $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;
    }

    public function logout() {
        dump($this->em);
    }
}