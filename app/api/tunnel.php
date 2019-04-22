<?php

namespace App\API;

use App\API\Token\MyTunnelToken;
use Look\Crypt\RSA\ProtectedStringData;

/**
 * Класс авторизации
 */
final class Tunnel
{
    /**
     * Служит для проверки Tunnel технологии
     * 
     * @param MyTunnelToken       $accessToken   -> Токен
     * @param ProtectedStringData $protectedData -> Зашифрованные данные
     * 
     * @return string|null
     */
    public static function checkTokenTunnelIn(MyTunnelToken $accessToken, ProtectedStringData $protectedData)
    {
        return $protectedData->decryptBy($accessToken->getDecryptServerKey())->getDecrypt();
    }
    
    /**
     * Служит для проверки Tunnel технологии
     * 
     * Шифрует сообщение "hello i protected message"
     * 
     * @param IDConfirmationTunnelToken $accessToken   -> Токен
     * @param ProtectedStringData       $protectedData -> Зашифрованные данные
     * 
     * @return string|null
     */
    public static function checkTokenTunnelOut(MyTunnelToken $accessToken)
    {
        $protectedData = new ProtectedStringData('hello i protected message');
        return $protectedData->encryptBy($accessToken->getEncryptServerKey())->getEncrypt();
    }
}