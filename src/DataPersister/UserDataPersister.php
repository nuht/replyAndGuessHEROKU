<?php
// src/DataPersister/UserDataPersister.php

namespace App\DataPersister;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 *
 */
class UserDataPersister implements ContextAwareDataPersisterInterface
{
    private EntityManagerInterface $_entityManager;
    private UserPasswordHasherInterface $_passwordHasher;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->_entityManager = $entityManager;
        $this->_passwordHasher = $passwordHasher;
    }

    /**
     * {@inheritdoc}
     */
    public function supports($data, array $context = []): bool
    {
        return $data instanceof User;
    }

    /**
     * @param User $data
     */
    public function persist($data, array $context = [])
    {
        if(array_key_exists('item_operation_name', $context) && $context['item_operation_name'] === 'put')
        {
            /*User en base*/
            $previousDataUser = $context['previous_data'];
            /*Mot de passe entré par l'user dans la requête*/
            $currentPassword = $data->getPassword();
            $isCurrentPasswordKnown = $this->_passwordHasher->isPasswordValid($previousDataUser, $currentPassword);

            if($isCurrentPasswordKnown === false)
            {
                throw new HttpException( 403, 'Wrong password');
            }

            if ($data->getPlainPassword() && $isCurrentPasswordKnown) {
                $data->setPassword(
                    $this->_passwordHasher->hashPassword(
                        $data,
                        $data->getPlainPassword()
                    )
                );

                $data->eraseCredentials();
            } else $data->setPassword($previousDataUser->getPassword());
            /*Le else du dessus sert à éviter de modifer le password de l'user par son mot de passe en clair, car il est envoyé dans la requête car on s'en sert pour vérifier que l'user le connait. Donc dans le else on set a nouveau son mot de passe par son ancien mot de passe crypté*/


            $this->_entityManager->persist($data);
            $this->_entityManager->flush();
            return;
        }

        if ($data->getPlainPassword()) {
            $data->setPassword(
                $this->_passwordHasher->hashPassword(
                    $data,
                    $data->getPlainPassword()
                )
            );

            $data->eraseCredentials();
        }

        $this->_entityManager->persist($data);
        $this->_entityManager->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function remove($data, array $context = [])
    {
        $this->_entityManager->remove($data);
        $this->_entityManager->flush();
    }
}
