<?php

namespace App\Entity;

use App\Entity\User;
use App\Entity\Customer;
use Assert\DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\DataProvider\Pagination;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\MongoDbOdm\Filter\OrderFilter;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
/**
 * @ApiResource(
 * subresourceOperations={"api_customers_invoices_get_subresource"={
 *  "normalization_context"={"groups"={"invoices_subresource"}}
 * }},
 * itemOperations={"GET","PUT","DELETE","increment"={
 * "method"="POST",
 * "path"="invoices/{id}/increment",
 * "controller"="App\Controller\InvoiceIncrementationController",
 * "openapi_context"={
 * "summary"="Increment une facture",
 * "description"="Increment le chrono d'une facture"
 * }
 * }},
 * attributes={
 * "pagination_enabled"=true, 
 * "pagination_items_per_page"=20,
 * "order"={"amount": "DESC"}
 * },
 * normalizationContext={"groups"={"invoices_read"}},
 * denormalizationContext={"disable_type_enforcement"=true},
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount","SentAt"})
 */

class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    private $id;

    #[ORM\Column(type: 'float')]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\NotBlank(message:"Le montant de la facture est obligatoire")]
    #[Assert\Type(type:"numeric", message:"Le montant de la facture doit être un nombre")]
    private $amount;

    #[ORM\Column(type: 'datetime')]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\NotBlank(message:"La date de envoi doit être renseignée")]
    private $sentAt;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\NotBlank(message:"Le client doit être renseigné")]
    #[Assert\Choice(['SENT', 'PAID', 'CANCELED'], message:"Le statut doit être SENT, PAID ou CANCELED")]
    private $status;

    #[ORM\ManyToOne(targetEntity: Customer::class, inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups("invoices_read")]
    #[Assert\NotBlank(message:"Le client doit être renseigné")]
    private $customer;

    #[ORM\Column(type: 'integer')]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\NotBlank(message:"il faut absolument un numéro pour la facture")]
    #[Assert\Type(type:'integer', message:"Le numéro de la facture doit être un nombre")]
    private $chrono;

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * permet de recuperer le user qui a cree l'invoice
     * @Groups({"invoices_read","invoices_subresource"})
     * @return User
     */
    public function getuser(): ?User
    {
        return $this->customer->getUser();
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount( $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt( $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
