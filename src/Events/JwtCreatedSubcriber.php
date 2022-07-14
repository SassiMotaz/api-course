<?php

Namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubcriber {

    public function updateJwtData(JWTCreatedEvent $event) {
        $user = $event->getUser();
        $data = $event->getData();
        $data['fisrtname'] = $user->getFirstname();
        $data['lastname'] = $user->getLastname();
        $event->setData($data);
    }

}
