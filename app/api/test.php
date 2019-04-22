<?php

class Test
{
    public static function getProtectedMessage(SimpleTunnelToken $accessToken)
    {
        $i   = 0;
        $str = '';
        while($i < 100) {
            $i++;
            $str .= 'a';
        }
        return (new ProtectedStringData($str))->encryptBy($accessToken->getEncryptServerKey())->getEncrypt();
    }
    
    public static function test(UnsignedIntegerArray $a, string $aaa = "123aaa",  bool ... $b)
    {
        var_dump(func_get_args());
    }
    
    public static function testEnum(TestEnum $enum)
    {
        if($enum == $enum::$Success) return 'success';
        if($enum == $enum::$Done)    return 'done';
        if($enum == $enum::$OK)      return 'ok';
    }
}