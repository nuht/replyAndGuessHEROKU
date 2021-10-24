<?php

namespace App\Controller;

use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ApiController extends AbstractController
{
    public function me(Request $request): JsonResponse
    {
        $om = $this->getDoctrine()->getManager();
        $userService = new UserService($request, $om);
        $data = $userService->getUserDataFromJwt();

        if($data === false)
        {
            return new JsonResponse($data, 401);
        } else return new JsonResponse($data, 200);
    }
}