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
     * @ORM\Column(type="text")
     */
    private $text;

    /**
     * @ORM\Column(type="boolean")
     */
    private $is_required;

    /**
     * @ORM\OneToOne(targetEntity=Multiple::class, inversedBy="question", cascade={"persist", "remove"})
     */
    private $multiple;

    /**
     * @ORM\OneToOne(targetEntity=TextArea::class, inversedBy="question", cascade={"persist", "remove"})
     */
    private $text_area;

    /**
     * @ORM\ManyToOne(targetEntity=Survey::class, inversedBy="questions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $survey;
    
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
        return $this->is_required;
    }

    public function setIsRequired(bool $is_required): self
    {
        $this->is_required = $is_required;

        return $this;
    }

    public function getMultiple(): ?Multiple
    {
        return $this->multiple;
    }

    public function setMultiple(?Multiple $multiple): self
    {
        $this->multiple = $multiple;

        return $this;
    }

    public function getTextArea(): ?TextArea
    {
        return $this->text_area;
    }

    public function setTextArea(?TextArea $text_area): self
    {
        $this->text_area = $text_area;

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
}
