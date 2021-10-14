<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ChoiceRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ChoiceRepository::class)
 */
#[ApiResource]
class Choice
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
    private $property_name;

    /**
     * @ORM\ManyToOne(targetEntity=Multiple::class, inversedBy="choices")
     * @ORM\JoinColumn(nullable=false)
     */
    private $multiple;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPropertyName(): ?string
    {
        return $this->property_name;
    }

    public function setPropertyName(string $property_name): self
    {
        $this->property_name = $property_name;

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
}
