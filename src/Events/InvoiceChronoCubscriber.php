<?php

Namespace App\Events ;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use App\Repository\CustomerRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoCubscriber implements EventSubscriberInterface {
    
    /**
     * @var Security
     */
    private $security;

    /**
     * @var InvoiceRepository
     */
    private $repository;
 

    public function __construct(Security $security, InvoiceRepository $repository ) {
        $this->security = $security;
        $this->repository = $repository;
    }

        public static function getSubscribedEvents() {
            return [
                KernelEvents::VIEW => ['setChrono', EventPriorities::PRE_VALIDATE],
            ];
        }

        public function setChrono(ViewEvent $event) {

            $invoice = $event->getControllerResult();
            $method = $event->getRequest()->getMethod();
            if (!$invoice instanceof Invoice || !in_array($method, ['POST'])) {
                return;
            }
            $invoice->setChrono($this->repository->findNextChrono($this->security->getUser()));
            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt(new \DateTime());
            }
        }
        

}