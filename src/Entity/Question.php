<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\QuestionRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=QuestionRepository::class)
 */
#[ApiResource]
class Question
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $text;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $prop_1;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $prop_2;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date_prop;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date_val;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date_refus;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date_publication;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date_fermeture;

    public function __construct()
    {
        $this->setDateProp(new \DateTime('NOW', new \DateTimeZone('Europe/Paris')));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getProp1(): ?string
    {
        return $this->prop_1;
    }

    public function setProp1(string $prop_1): self
    {
        $this->prop_1 = $prop_1;

        return $this;
    }

    public function getProp2(): ?string
    {
        return $this->prop_2;
    }

    public function setProp2(string $prop_2): self
    {
        $this->prop_2 = $prop_2;

        return $this;
    }

    public function getDateProp(): ?\DateTimeInterface
    {
        return $this->date_prop;
    }

    public function setDateProp(\DateTimeInterface $date_prop): self
    {
        $this->date_prop = $date_prop;

        return $this;
    }

    public function getDateVal(): ?\DateTimeInterface
    {
        return $this->date_val;
    }

    public function setDateVal(?\DateTimeInterface $date_val): self
    {
        $this->date_val = $date_val;

        return $this;
    }

    public function getDateRefus(): ?\DateTimeInterface
    {
        return $this->date_refus;
    }

    public function setDateRefus(?\DateTimeInterface $date_refus): self
    {
        $this->date_refus = $date_refus;

        return $this;
    }

    public function getDatePublication(): ?\DateTimeInterface
    {
        return $this->date_publication;
    }

    public function setDatePublication(?\DateTimeInterface $date_publication): self
    {
        $this->date_publication = $date_publication;

        return $this;
    }

    public function getDateFermeture(): ?\DateTimeInterface
    {
        return $this->date_fermeture;
    }

    public function setDateFermeture(?\DateTimeInterface $date_fermeture): self
    {
        $this->date_fermeture = $date_fermeture;

        return $this;
    }
}
