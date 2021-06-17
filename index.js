
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

//******************************************************************************************************************//
//                         Добавляем все слушатели                                                                  //
//                                                                                                                  //
//******************************************************************************************************************//

//******************************************************************************************************************//
//                    Код для правой секции (валюты + инпуты пользовательского ввода)                               //
//                                                                                                                  //
//******************************************************************************************************************//

/** Устанавливаем валюту в правом инпуте*/
//  Переменую подаём на вход  функцию updateFetch  по одному значеию из правого и левго инпута  Далее закрашиваем кнопку  в цвет из макета и сбрасываем цвет на базовый для остальных  

function changeColorBtn(butonSide, selectSide, currency) {
    butonSide.forEach((item) => {
        item.style.color = '#C6C6C6';
        item.style.backgroundColor = 'white';
    });
    selectSide.style.color = '#C6C6C6';
    selectSide.style.backgroundColor = 'white';

    // Идём по массиву  и с помощью  find находим кнопку значение которой равно значению валюты из currency и find  возвращает эту кнопку и закрашивает её. Если таой кнопки нет, тогда был клик по селекту и мы в else закрашиваем селект
    let btnWhenChangeColor = butonSide.find((item) => {

        return item.innerText === currency;
    })
    if (btnWhenChangeColor) {
        btnWhenChangeColor.style.color = '#FFFFFF';
        btnWhenChangeColor.style.backgroundColor = '#833AE0';
    } else {
        selectSide.style.color = '#FFFFFF';
        selectSide.style.backgroundColor = '#833AE0';
        selectSide.value = currency;
    }

    // currencyCalculationRight();
}

//  достаём значение кнопки через event.target.innerText (вот тут : buttonsRight.forEach((item)) на строке 84 потом записываем в обьявленую глобалью переменную и меняем цвет
function currRightButtons(currency) {
    currencyRight = currency;

    changeColorBtn(buttonsRight, selectRight, currency);                                // Идём по массиву сбрасываем всех в серый цвет                                                                                            // Присваеваем глобальной переменной  currencyRight значение валюты из currency
    // получаем значения из сервера и записываем внизу в инпуте в окне с курсами валют 
    updateValueFromInput(currencyLeft, currencyRight)
        .then((dataObject) => {
            currentExchangeRateRight.innerText = `1 ${currencyLeft}  = ${dataObject.dataFrom.toFixed(4)} ${currencyRight}`;
            currentExchangeRateLeft.innerText = `1 ${currencyRight} = ${dataObject.dataTo.toFixed(4)}  ${currencyLeft}`;
            textInputRight.value = textInputLeft.value * dataObject.dataFrom.toFixed(4);

        })
}
// при выборе валюты в селекте, значением select.value является строка с значением самой валюты и мы с эти значеиме вызываем функцию currRightButtons которая красит кнопки, перезаписывает значение глобальной переменной и даные с сервера записывает вниз инпута с курсом валют 

buttonsRight.forEach((item) => {

    item.addEventListener('click', (event) => {
        currRightButtons(event.target.innerText)
        currencyCalculationLeft()
        // console.log(currencyLeft)
        // console.log(currencyRight)
    })
})

// В правый инпут вставляем Пользовательский ввод из левого инпута умноженный на курс валюты в которую конвертируем
textInputRight.addEventListener('keyup', (event) => {
    // currencyCalculationRight();

    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
        updateValueFromInput(currencyLeft, currencyRight)
            .then((dataObj) => {
                if (textInputRight.value) {
                    let temporary = '';
                    temporary = textInputRight.value * dataObj.dataTo.toFixed(4);
                    textInputLeft.value = temporary.toFixed(4);

                }
            })
    }, 1000)




})

// при выборе валюты в селекте, значением select.value является строка с значением самой валюты и мы с эти значеием вызываем функцию currRightButtons которая красит кнопки, перезаписывает значение глобальной переменной и даные с сервера записывает вниз инпута с курсом валют 
selectRight.addEventListener('change', (event) => {
    currRightButtons(event.target.value)

})
