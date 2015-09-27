<?php
namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use phpseclib\Crypt\RSA;

class MainController extends Controller
{
    public function addRecord(Request $request)
    {
        $rsa = new RSA();
        $rsa->loadKey(Config::get('keys.private')); // private key

        $encryptedData = $request->input('data');

        //Выставляем нужный режим декодировния
        $rsa->setEncryptionMode(RSA::ENCRYPTION_PKCS1);

        //Декодируем куски текста
        $decryptedData = '';
        foreach ($encryptedData as $encryptedDataSubstring) {
            $decryptedData .= $rsa->decrypt(base64_decode($encryptedDataSubstring));
        }

        //Преобразуем декодированный текст из json массива
        $data = json_decode($decryptedData, true);
        if ($data) {
            //Пишем в базу только если есть данные
            if (array_get($data, 'data')) {
                Record::create($data);
            }
        }

        //Возвращать ничего не нужно
        return '';
    }
}
