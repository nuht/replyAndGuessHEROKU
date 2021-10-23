<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ChoiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

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
    #[Groups("survey:write")]
    private $propertyName;

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
        return $this->propertyName;
    }

    public function setPropertyName(string $propertyName): self
    {
        $this->propertyName = $propertyName;

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
