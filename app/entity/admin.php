<?php

namespace App\Entity;

class Admin extends \App\Entity\User
{
    public function __construct(string $name) {
        parent::__construct($name);
    }
}