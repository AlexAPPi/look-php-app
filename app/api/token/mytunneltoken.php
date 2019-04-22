<?php

namespace App\API\Token;

use Look\API\Type\Token\SimpleTunnelToken;

/**
 * My app tunnel token
 */
class MyTunnelToken extends SimpleTunnelToken
{
    const necessaryPermits = ['example']; // token premits
}