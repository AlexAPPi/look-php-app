<?php

namespace App\Entity;

use Look\API\Type\Arrays\ObjectArray;

class UserList extends ObjectArray
{
    const ItemType = \App\Entity\User::class;
    
    public function __construct(User ...$items) {
        parent::__construct($items);
    }
}