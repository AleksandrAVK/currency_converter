
let buttonsLeft = Array.from(document.querySelectorAll('.buttonLeft'));
let buttonsRight = Array.from(document.querySelectorAll('.buttonRight'));

let select = document.querySelectorAll('.select');
let selectRight = document.querySelector('.selectRight');
let selectLeft = document.querySelector('.selectLeft');

let currentExchangeRateRight = document.querySelector('.currentExchangeRateRight');
let currentExchangeRateLeft = document.querySelector('.currentExchangeRateLeft');

let textInputLeft = document.querySelector('.textareaInput-left');
let textInputRight = document.querySelector('.textareaInput-right');

let currencyLeft = "RUB";
let currencyRight = "USD";

let overlay = document.querySelector('.overlay');
let loading = document.querySelector('.loading')

let arrow = document.querySelector('.arrow');
let timeOutId;

/** Устанавливаем валюту по умолчанию в обоих блоках с инпутами*/
currRightButtons(currencyRight);
currLeftButtons(currencyLeft);


//******************************************************************************************************************//
//                     Получаем два курса валют из сервера. Например: rub-usd;usd-rub                               //
//                     и возвращаем два курса валют как числа числа                                                 //
//                                                                                                                  //
//******************************************************************************************************************//
