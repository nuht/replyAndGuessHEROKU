<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\QuestionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

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
    #[Groups("survey:read")]
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    #[Groups(["survey:write", "survey:read"])]
    private $text;

    /**
     * @ORM\Column(type="boolean", options={"default" : false})
     */
    #[Groups(["survey:write", "survey:read"])]
    private $isRequired;

    /**
     * @ORM\ManyToOne(targetEntity=Survey::class, inversedBy="questions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $survey;

    /**
     * @ORM\Column(type="json")
     */
    #[Groups(["survey:write", "survey:read"])]
    private $choices = [];

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(["survey:write", "survey:read"])]
    private $choicesType;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(["survey:write", "survey:read"])]
    private $type;
    
    public function __construct()
    {
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

    public function getIsRequired(): ?bool
    {
        return $this->isRequired;
    }

    public function setIsRequired(bool $isRequired): self
    {
        $this->isRequired = $isRequired;

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

    public function getChoices(): ?array
    {
        return $this->choices;
    }

    public function setChoices(array $choices): self
    {
        $this->choices = $choices;

        return $this;
    }

    public function getChoicesType(): ?string
    {
        return $this->choicesType;
    }

    public function setChoicesType(string $choicesType): self
    {
        $this->choicesType = $choicesType;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
