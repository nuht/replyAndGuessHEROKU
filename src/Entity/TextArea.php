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
    private $text_answer;

    /**
     * @ORM\OneToOne(targetEntity=Question::class, mappedBy="text_area", cascade={"persist", "remove"})
     */
    private $question;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTextAnswer(): ?string
    {
        return $this->text_answer;
    }

    public function setTextAnswer(string $text_answer): self
    {
        $this->text_answer = $text_answer;

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
