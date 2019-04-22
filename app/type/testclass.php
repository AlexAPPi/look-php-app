<?php

namespace App\Type;

class TestClass
{
    private $a = 10;
    private $b = 10.00;

    public function __construct(float $value, int $value2) {
        $this->a = $value;
        $this->b = $value2;
    }
}