<?php

namespace App\Controller;

use App\Entity\Company;
use App\Entity\Result;
use App\Entity\Survey;
use App\Entity\User;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\Response;

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

    public function getUserIriFromHash(Request $request): JsonResponse
    {
        $om = $this->getDoctrine()->getManager();
        $userRepository = $om->getRepository(User::class);

        $content = json_decode($request->getContent(), true);
        $hashUser = $content['userHash'];

        $user = $userRepository->findBy(['hash' => $hashUser]);

        if(sizeof($user) === 0) {
            return new JsonResponse("L'utilisateur n'existe pas.", Response::HTTP_NOT_FOUND);
        } else return new JsonResponse("/api/users/" . $user[0]->getId(), Response::HTTP_OK);
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

        if($this->userIsNotFound($user)) {
            return new JsonResponse("L'utilisateur n'existe pas.", Response::HTTP_NOT_FOUND);
        } elseif(sizeof($survey) === 0) {
            return new JsonResponse("Le sondage n'existe pas.", Response::HTTP_NOT_FOUND);;
        } elseif($user[0]->getCompany() === $survey[0]->getCompany()) {
            $result = $resultRepository->findBy(['survey' => $survey[0]->getId(), 'user' => $user[0]->getId()]);
            if(sizeof($result) === 0) {
                $response = $this->client->request('GET', 'http://127.0.0.1:8000/api/surveys/' . $survey[0]->getId());
                $content = $response->getContent();
                return new JsonResponse(json_encode(json_decode($content)), Response::HTTP_OK, [], true);
            } else return new JsonResponse("Vous avez déjà répondu à ce sondage.", Response::HTTP_CONFLICT);
        } else return new JsonResponse("L'utilisateur n'a pas la bonne company", Response::HTTP_UNAUTHORIZED);
    }

    public function sendEmail(MailerInterface $mailer, Request $request, UserPasswordHasherInterface $passwordHasher
    ): JsonResponse
    {
        $apiUrl = $_ENV['API_URL'];
        dd($apiUrl);

        /*
         * Vérifier que l'user possède bien le role company
         * Envoyer un email pour chaque email de la liste
         * */
        $om = $this->getDoctrine()->getManager();
        $userRepository = $om->getRepository(User::class);
        $surveyRepository = $om->getRepository(Survey::class);

        $content =$request->getContent();
        $json = json_decode($content, true);
        $user = $userRepository->findOneBy(['hash' => $json['userHash']]);
        $company = $user->getCompany();
        if(!in_array('ROLE_COMPANY', $user->getRoles()))
        {
            return new JsonResponse("Interdit", 401);
        }

        $survey = $surveyRepository->findOneBy(['hash' => $json['surveyHash']]);
        if($survey === null) {
            return new JsonResponse("Le sondage n'existe pas.", 404);;
        }

        if(sizeof($json['emails']) === 0) {
            return new JsonResponse("Pas d'emails", 400);
        } else {
            foreach($json['emails'] as $email) {
                $currentUser = $userRepository->findOneBy(['email' => $email]);
                if($currentUser === null) {
                    $currentUser = new User();
                    $currentUser->setCompany($company);
                    $currentUser->setEmail($email);
                    $password = $passwordHasher->hashPassword($currentUser, '');
                    $currentUser->setPassword($password);
                    $currentUser->setIsPending(false);
                    $om->persist($currentUser);
                }

                $url = "${apiUrl}/answerSurvey?userHash={$currentUser->getHash()}&surveyHash={$survey->getHash()}";

                $email = (new Email())
                    ->from('replySurvey@project.com')
                    ->to($email)
                    //->cc('cc@example.com')
                    //->bcc('bcc@example.com')
                    //->replyTo('fabien@example.com')
                    //->priority(Email::PRIORITY_HIGH)
                    ->subject('Invitation à répondre au sondage ' . $survey->getTitle())
                    ->html("<p>Vous avez été invité par : {$company->getName()} à répondre au sondage suivant :    <a href='{$url}'>{$survey->getTitle()}</a>  </p>");

                $mailer->send($email);
            }
            $om->flush();
        }


        return new JsonResponse('Email envoyé', 204);
    }

    /**
     * @param array $user
     * @return bool
     */
    private function userIsNotFound(array $user): bool
    {
        return sizeof($user) === 0;
    }


}
