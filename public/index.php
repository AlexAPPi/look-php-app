<?php

/** @var float Время начала обработки запроса */
define('APP_START', microtime(true));

/** @var string Режим отладки */
define('DEBUG', true);

/** @var string Название приложения */
define('APP_NAME', 'app');

/** @var string Родительская директория директории приложения /app/../  */
define('ROOT_APP_DIR', dirname(__DIR__));

if(isset($_GET['main'])) {
    include __DIR__ . '/main.php';
    return;
}

try
{
    require ROOT_APP_DIR . '/../lookphp.loc/look/autoload.php';
    
    $val = new Look\Type\UnsignedInteger(10);
    
    $arr = new \Look\Type\BooleanArray(true, false, true);
    $arr = new \Look\Type\NoStrict\IntegerArray('10', false, 20, 10);
    //$arr = new \Look\Type\DoubleArray(10.0, 10.0, 10.0);
    //$arr = new \Look\Type\StringArray('123', 123);
    
    var_dump($val, $arr);
    /*
    
    $page = new \Look\Page\HtmlPage();
    
    $page->setMeta('hello', 'hello');
    $page->setCanonical('https://value/');
    
    echo $page;
     * 
     */
}
catch (Throwable $ex) {
    //err_log($ex);
    echo $ex;
    //echo 'failed start see log file';
}