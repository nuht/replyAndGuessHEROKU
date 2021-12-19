<?php

namespace App\Controller;

use App\Entity\Result;
use App\Entity\Survey;
use App\Entity\User;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiController extends AbstractController
{
    private $client;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
    }

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

    public function answerSurvey(Request $request): JsonResponse
    {
        $om = $this->getDoctrine()->getManager();
        $userRepository = $om->getRepository(User::class);
        $surveyRepository = $om->getRepository(Survey::class);
        $resultRepository = $om->getRepository(Result::class);

        $content = json_decode($request->getContent(), true);
        $hashUser = $content['userHash'];
        $hashSurvey = $content['surveyHash'];

        $user = $userRepository->findBy(['hash' => $hashUser]);
        $survey = $surveyRepository->findBy(['hash' => $hashSurvey]);


        if(sizeof($user) === 0) {
            return new JsonResponse("L'utilisateur n'existe pas.", 404);
        } elseif(sizeof($survey) === 0) {
            return new JsonResponse("Le sondage n'existe pas.", 404);;
        } elseif($user[0]->getCompany() === $survey[0]->getCompany()) {
            $result = $resultRepository->findBy(['survey' => $survey[0]->getId(), 'user' => $user[0]->getId()]);
            if(sizeof($result) === 0) {
                $response = $this->client->request('GET', 'http://127.0.0.1:8000/api/surveys/' . $survey[0]->getId());
                $content = $response->getContent();
                return new JsonResponse(json_encode(json_decode($content)), 200, [], true);
            } else return new JsonResponse("L'utilisateur a déjà répondu", 400);
        } else return new JsonResponse("L'utilisateur n'a pas la bonne company", 401);
    }
}