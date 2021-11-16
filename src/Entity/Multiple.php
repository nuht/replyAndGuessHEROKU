<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\MultipleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=MultipleRepository::class)
 */
class Multiple
{
    const TYPE_RADIO = 'radio';
    const TYPE_CHECKBOXES = 'checkboxes';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups("survey:read")]
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    #[Groups(["survey:write", "survey:read"])]
    private $type;

    /**
     * @ORM\OneToMany(targetEntity=Choice::class, mappedBy="multiple", orphanRemoval=true, cascade={"persist"})
     */
    #[Groups(["survey:write", "survey:read"])]
    private $choices;

    /**
     * @ORM\OneToOne(targetEntity=Question::class, mappedBy="multiple", cascade={"persist", "remove"})
     */
    private $question;

    public function __construct()
    {
        $this->choices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        if (!in_array($type, [self::TYPE_RADIO, self::TYPE_CHECKBOXES])) {
            throw new \InvalidArgumentException("Invalid status");
        }
        $this->type = $type;

        return $this;
    }

    /**
     * @return Collection|Choice[]
     */
    public function getChoices(): Collection
    {
        return $this->choices;
    }

    public function addChoice(Choice $choice): self
    {
        if (!$this->choices->contains($choice)) {
            $this->choices[] = $choice;
            $choice->setMultiple($this);
        }

        return $this;
    }

    public function removeChoice(Choice $choice): self
    {
        if ($this->choices->removeElement($choice)) {
            // set the owning side to null (unless already changed)
            if ($choice->getMultiple() === $this) {
                $choice->setMultiple(null);
            }
        }

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
            $this->question->setMultiple(null);
        }

        // set the owning side of the relation if necessary
        if ($question !== null && $question->getMultiple() !== $this) {
            $question->setMultiple($this);
        }

        $this->question = $question;

        return $this;
    }
}
