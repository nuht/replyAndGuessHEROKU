<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class RefreshRequestListener implements EventSubscriberInterface {
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    public function onKernelRequest(RequestEvent $event) {
        $request = $event->getRequest();

        /*Si on est la route pour refresh le token, permet d'ajouter en attribut de la requete le cookie contenant notre refresh token*/
        if($request->attributes->get('_route') === 'gesdinet_jwt_refresh_token') {
            if($request->cookies->get('REFRESH_TOKEN')) {
                $request->attributes->set('refresh_token', $request->cookies->get('REFRESH_TOKEN'));
            } else throw new BadRequestException();
        }
    }

    public static function getSubscribedEvents()
    {
        return [
          KernelEvents::REQUEST => [
              ['onKernelRequest', 10]
          ]
        ];
    }
}