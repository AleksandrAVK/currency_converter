
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

async function updateValueFromInput(from, to) {
    // console.log(from, to);

    try {
        if (from === to) {
            return { dataFrom: 1, dataTo: 1 }
        }
        clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            overlay.classList.add('overlayIs-open');
            overlay.classList.remove('overlay');
            loading.classList.add('is-active');
        }, 1000)
        let responseFROM = await fetch(`https://v6.exchangerate-api.com/v6/51c7eb977c01e5b2d833a34f/pair/${from}/${to}`);
        hideOverlay();

        const dataFrom = await responseFROM.json();
        // console.log("из какой валюты стр 52", dataFrom)
        let responseTO = await fetch(`https://v6.exchangerate-api.com/v6/51c7eb977c01e5b2d833a34f/pair/${to}/${from}`);


        clearTimeout(timeOutId);
        hideOverlay();
        const dataTo = await responseTO.json();
        // console.log(" в какую валюту стр 59", dataTo)
        // console.log(" в какую конкретно валюту стр 60", dataTo.conversion_rate, dataFrom.conversion_rate)

        return { dataTo: dataTo.conversion_rate, dataFrom: dataFrom.conversion_rate }
    } catch (error) {
        alert("Не удалось отправить запрос. Попробуйте позже.");
        clearTimeout(timeOutId);
        hideOverlay();
    }

}
