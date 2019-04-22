<?php

/** @var float Время начала обработки запроса */
define('APP_START', microtime(true));

/** @var string Режим отладки */
define('DEBUG', true);

/** @var string Название приложения */
define('APP_NAME', 'app');

/** @var string Родительская директория директории приложения /app/../  */
define('ROOT_APP_DIR', dirname(__DIR__));

try
{
    require ROOT_APP_DIR . '/../lookphp.loc/look/autoload.php';
    echo 'hello is simple app';
}
catch (Throwable $ex) {
    err_log($ex);
    echo 'failed start see log file';
}