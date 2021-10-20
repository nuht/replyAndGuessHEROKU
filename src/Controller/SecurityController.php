<?php

namespace App\Controller;

use App\Service\LogoutService;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    /**
     * @Route("/logout", name="logout")
     * @param LogoutService $logoutService
     */
    public function logout(LogoutService $logoutService, Request $request)
    {
        $om = $this->getDoctrine()->getManager();
        $userService = new UserService($request, $om);
        $logoutService->logout($request, $userService);
        return new JsonResponse('User logged out', 200);
    }
}