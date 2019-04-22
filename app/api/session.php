<?php

namespace App\API;

use App\API\Token\MyTunnelToken;

/**
 * Класс реализующий работу сессии
 */
class Session
{
    /**
     * Возвращает токен, подтверждающий личность пользователя
     * 
     * @param string $login     -> Логин
     * @param string $signature -> Хеш логина и пароля
     * @param int    $expires   -> Время жизни токена
     * @return type
     */
    public static function open(string $login, string $signature, int $expires = 0)
    {
        $userId = 1;
        return MyTunnelToken::create($userId, $signature, $expires);
    }
}