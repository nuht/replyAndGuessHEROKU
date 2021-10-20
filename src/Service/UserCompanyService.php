<?php

namespace App\Service;

use Doctrine\Persistence\ObjectManager;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class UserCompanyService
{
    private $request;
    private $em;
    private $httpClient;

    public function __construct(Request $request, ObjectManager $em, HttpClientInterface $httpClient)
    {
        $this->request = $request;
        $this->em = $em;
        $this->httpClient = $httpClient;
    }

    public function createSurvey(): ResponseInterface
    {
        $data = $this->request->toArray();
        $response = $this->httpClient->request('POST', 'http://127.0.0.1:8000/api/surveys', [
            'headers' => [
                'Content-Type' => $this->request->headers->get('content-type'),
            ],
            'body' => json_encode($data,true)
        ]);
        return $response;
    }
}