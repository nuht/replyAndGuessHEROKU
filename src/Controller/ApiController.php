<?php

namespace App\Controller;

use App\Service\UserService;
use App\Service\UserCompanyService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;

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

    public function createSurvey(Request $request, HttpClientInterface $httpClient): JsonResponse
    {
        $om = $this->getDoctrine()->getManager();
        $userService = new UserService($request, $om);
        $data = $userService->getUserDataFromJwt();

        if(!in_array('ROLE_COMPANY', $data['jwt']->roles))
        {
            return new JsonResponse($data, 401);
        } else {
            $userCompanyService = new UserCompanyService($request, $om, $httpClient);
            $response = $userCompanyService->createSurvey();
            return new JsonResponse($data, $response->getStatusCode());
        }
    }
}