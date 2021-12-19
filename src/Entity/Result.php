<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ResultRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ResultRepository::class)
 */
#[ApiResource(
    denormalizationContext: ["groups" => ["result:write"]]
)]
class Result
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $answerDate;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    #[Groups(["result:write"])]
    private $value = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $valuePredict = [];

    /**
     * @ORM\ManyToOne(targetEntity=Survey::class, inversedBy="results")
     * @ORM\JoinColumn(nullable=false)
     */
    #[Groups(["result:write"])]
    private $survey;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="results")
     * @ORM\JoinColumn(nullable=false)
     */
    #[Groups(["result:write"])]
    private $user;

    public function __construct()
    {
        $this->setAnswerDate(new \DateTime('NOW', new \DateTimeZone('Europe/Paris')));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAnswerDate(): ?\DateTimeInterface
    {
        return $this->answerDate;
    }

    public function setAnswerDate(\DateTimeInterface $answerDate): self
    {
        $this->answerDate = $answerDate;

        return $this;
    }

    public function getValue(): ?array
    {
        return $this->value;
    }

    public function setValue(?array $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getValuePredict(): ?array
    {
        return $this->valuePredict;
    }

    public function setValuePredict(?array $valuePredict): self
    {
        $this->valuePredict = $valuePredict;

        return $this;
    }

    public function getSurvey(): ?Survey
    {
        return $this->survey;
    }

    public function setSurvey(?Survey $survey): self
    {
        $this->survey = $survey;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
