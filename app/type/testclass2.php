<?php

namespace App\Type;

class TestClass2
{
    private $a = 10;

    public function __construct(TestClass $value) {
        $this->a = $value;
    }
}