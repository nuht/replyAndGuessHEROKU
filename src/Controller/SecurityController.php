<?php

namespace App\Controller;

use App\Service\LogoutService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    /**
     * @Route("/logout", name="logout")
     * @param LogoutService $logoutService
     */
    public function logout(LogoutService $logoutService)
    {
        $logoutService->logout();
    }
}