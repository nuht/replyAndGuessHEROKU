<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\SurveyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * @ORM\Entity(repositoryClass=SurveyRepository::class)
 */
#[ApiResource(
    denormalizationContext: ["groups" => ["survey:write"]],
    normalizationContext: ["groups" => ["survey:read"]],
    itemOperations: [
        "get" => [
            "security" => "is_granted('CAN_ANSWER', object)",
            "security_message" => "Vous pouvez seulement répondre une seule fois par sondage.",
        ],
        "put" => ['method' => 'put']
    ]
)]
class Survey
{
    const STATUS_WAITING = 'waiting';
    const STATUS_OPENED = 'opened';
    const STATUS_CLOSED = 'closed';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups("survey:read")]
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    #[Groups("survey:read")]
    private $publishedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    #[Groups("survey:read")]
    private $closedAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    #[Groups(["survey:write", "survey:read"])]
    private $title;

    /**
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    #[Groups(["survey:write", "survey:read"])]
    private $description;

    /**
     * @ORM\Column(type="string")
     */
    #[Groups(["survey:write", "survey:read"])]
    private $status;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    #[Groups("survey:read")]
    private $configSettings = [];

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups("survey:read")]
    private $hash;

    /**
     * @ORM\OneToMany(targetEntity=Question::class, mappedBy="survey", orphanRemoval=true, cascade={"persist"})
     */
    #[Groups(["survey:write", "survey:read"])]
    private $questions;

    /**
     * @ORM\OneToMany(targetEntity=Result::class, mappedBy="survey", orphanRemoval=true)
     */
    private $results;

    /**
     * @ORM\ManyToOne(targetEntity=Company::class, inversedBy="surveys")
     * @ORM\JoinColumn(nullable=false)
     */
    #[Groups("survey:write")]
    private $company;

    public function __construct()
    {
        $this->setHash(new Ulid());
        $this->setPublishedAt(new \DateTime('NOW', new \DateTimeZone('Europe/Paris')));
        $this->setStatus('waiting');
        $this->questions = new ArrayCollection();
        $this->results = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPublishedAt(): ?\DateTimeInterface
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(\DateTimeInterface $publishedAt): self
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getClosedAt(): ?\DateTimeInterface
    {
        return $this->closedAt;
    }

    public function setClosedAt(?\DateTimeInterface $closedAt): self
    {
        $this->closedAt = $closedAt;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        if (!in_array($status, [self::STATUS_OPENED, self::STATUS_CLOSED, self::STATUS_WAITING])) {
            throw new HttpException( 400, 'Invalid status');
        }
        $this->status = $status;

        return $this;
    }

    public function getConfigSettings(): ?array
    {
        return $this->configSettings;
    }

    public function setConfigSettings(?array $configSettings): self
    {
        $this->configSettings = $configSettings;

        return $this;
    }

    public function getHash()
    {
        return $this->hash;
    }

    public function setHash($hash): self
    {
        $this->hash = $hash;

        return $this;
    }

    /**
     * @return Collection|Question[]
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Question $question): self
    {
        if (!$this->questions->contains($question)) {
            $this->questions[] = $question;
            $question->setSurvey($this);
        }

        return $this;
    }

    public function removeQuestion(Question $question): self
    {
        if ($this->questions->removeElement($question)) {
            // set the owning side to null (unless already changed)
            if ($question->getSurvey() === $this) {
                $question->setSurvey(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Result[]
     */
    public function getResults(): Collection
    {
        return $this->results;
    }

    public function addResult(Result $result): self
    {
        if (!$this->results->contains($result)) {
            $this->results[] = $result;
            $result->setSurvey($this);
        }

        return $this;
    }

    public function removeResult(Result $result): self
    {
        if ($this->results->removeElement($result)) {
            // set the owning side to null (unless already changed)
            if ($result->getSurvey() === $this) {
                $result->setSurvey(null);
            }
        }

        return $this;
    }

    public function getCompany(): ?Company
    {
        return $this->company;
    }

    public function setCompany(?Company $company): self
    {
        $this->company = $company;

        return $this;
    }
}
