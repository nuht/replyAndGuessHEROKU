<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ResultRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ResultRepository::class)
 */
#[ApiResource]
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
    private $answer_date;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $value = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $value_predict = [];

    /**
     * @ORM\ManyToOne(targetEntity=Survey::class, inversedBy="results")
     * @ORM\JoinColumn(nullable=false)
     */
    private $survey;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="results")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user_id;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAnswerDate(): ?\DateTimeInterface
    {
        return $this->answer_date;
    }

    public function setAnswerDate(\DateTimeInterface $answer_date): self
    {
        $this->answer_date = $answer_date;

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
        return $this->value_predict;
    }

    public function setValuePredict(?array $value_predict): self
    {
        $this->value_predict = $value_predict;

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

    public function getUserId(): ?User
    {
        return $this->user_id;
    }

    public function setUserId(?User $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }
}
