<?php

/** @var string Режим отладки */
define('DEBUG', true);

/** @var string Название приложения */
define('APP_NAME', 'app');

/** @var string Родительская директория директории приложения /app/../  */
define('ROOT_APP_DIR', dirname(__DIR__));

require ROOT_APP_DIR . '/../lookphp.loc/look/api.php';