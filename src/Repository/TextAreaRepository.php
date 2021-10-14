<?php

namespace App\Repository;

use App\Entity\TextArea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TextArea|null find($id, $lockMode = null, $lockVersion = null)
 * @method TextArea|null findOneBy(array $criteria, array $orderBy = null)
 * @method TextArea[]    findAll()
 * @method TextArea[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TextAreaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TextArea::class);
    }

    // /**
    //  * @return TextArea[] Returns an array of TextArea objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TextArea
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
