<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\TextAreaRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=TextAreaRepository::class)
 */
#[ApiResource]
class TextArea
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
    private $textAnswer;

    /**
     * @ORM\OneToOne(targetEntity=Question::class, mappedBy="textArea", cascade={"persist", "remove"})
     */
    private $question;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTextAnswer(): ?string
    {
        return $this->textAnswer;
    }

    public function setTextAnswer(string $textAnswer): self
    {
        $this->textAnswer = $textAnswer;

        return $this;
    }

    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    public function setQuestion(?Question $question): self
    {
        // unset the owning side of the relation if necessary
        if ($question === null && $this->question !== null) {
            $this->question->setTextArea(null);
        }

        // set the owning side of the relation if necessary
        if ($question !== null && $question->getTextArea() !== $this) {
            $question->setTextArea($this);
        }

        $this->question = $question;

        return $this;
    }
}
