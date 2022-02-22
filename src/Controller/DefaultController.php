<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/{reactRouting}", name="home", defaults={"reactRouting": null}, priority="-1", requirements={"reactRouting"="^.+"})
     */
    public function index()
    {
        return $this->render('base.html.twig');
    }
}
