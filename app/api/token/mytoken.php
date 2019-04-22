<?php

namespace App\API\Token;

use Look\API\Type\Token\SimpleToken;

/**
 * My app token
 */
class MyToken extends SimpleToken
{
    const necessaryPermits = ['example']; // token premits
}