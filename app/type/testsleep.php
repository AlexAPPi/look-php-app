<?php

namespace App\Type;

class TestSleep
{
    private $a = 10;

    public function __construct($value) {
        $this->a = $value;
    }
    
    function __sleep() : array
    {
        return ['a'];
    }

    function __wakeup() : void
    {
        echo 'i wakeup';
    }
}