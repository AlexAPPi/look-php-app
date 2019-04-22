<?php

namespace App\API;

use Look\API\Caller;
use Look\API\Type\Token\SimpleTunnelToken;

use Look\Crypt\RSA\ProtectedStringData;

use App\Entity\User as UserEntity;
use App\Entity\UserList;

class User
{
    public static function a()
    {
        return SimpleTunnelToken::create(Caller::getTokenDB(), 1, '12345');
    }
    
    public static function e(SimpleTunnelToken $token)
    {
        return (new ProtectedData('hello me is best'))->encryptBy($token->getEncryptUserKey());
    }
    
    public static function b(SimpleTunnelToken $token, ProtectedStringData $data)
    {
        var_dump($data);
        $res = $data->decryptBy($token->getDecryptServerKey())->getDecrypt();
        var_dump($res);
        return null;
    }
    
    public static function test(SimpleTunnelToken $token, UserList $user)
    {
        
    }
}
