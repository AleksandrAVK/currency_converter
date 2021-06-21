
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

// API бесплатный с ограничением по количеству зпросов. Пришлось делать 3 учётных записи 

let yandexKey = '51c7eb977c01e5b2d833a34f';
let mail17Key = 'bfe77b8783fe3967098b97cd';
let mailVinKey = 'f2f1f6ffad4b333ca7c58737';


/** Устанавливаем валюту по умолчанию в обоих блоках с инпутами*/
currRightButtons(currencyRight);
currLeftButtons(currencyLeft);


//******************************************************************************************************************//
//                     Получаем два курса валют из сервера. Например: rub-usd;usd-rub                               //
//                     и возвращаем два курса валют как числа числа                                                 //
//                                                                                                                  //
//******************************************************************************************************************//

async function updateValueFromInput(from, to) {

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
        let responseFROM = await fetch(`https://v6.exchangerate-api.com/v6/bfe77b8783fe3967098b97cd/pair/${from}/${to}`);
        hideOverlay();
//******************************************************************************************************************//
//                        АРI  бесплатный. Есть ограничения по количеству запросов.                                 //
//                   Создал две учётных записи.Когда лимит запросов на 1 - ой закончится,                           //
//                            будет использована вторая.                                                            //
//******************************************************************************************************************//

        const dataFrom = await responseFROM.json();
        if (dataFrom === "undefined" || dataFrom === "null" || dataFrom === '') {
            let responseFROM = await fetch(`https://v6.exchangerate-api.com/v6/f2f1f6ffad4b333ca7c58737/pair/${from}/${to}`);
            hideOverlay();
            const dataFrom = await responseFROM.json();
        }


        let responseTO = await fetch(`https://v6.exchangerate-api.com/v6/bfe77b8783fe3967098b97cd/pair/${to}/${from}`);
        clearTimeout(timeOutId);
        hideOverlay();
        const dataTo = await responseTO.json();

//******************************************************************************************************************//
//                        АРI  бесплатный. Есть ограничения по количеству запросов.                                 //
//                   Создал две учётных записи.Когда лимит запросов на 1 - ой закончится,                           //
//                            будет использована вторая.                                                            //
//******************************************************************************************************************//

        if (dataTo === "undefined" || dataTo === "null" || dataTo === '') {
            let responseTO = await fetch(`https://v6.exchangerate-api.com/v6/f2f1f6ffad4b333ca7c58737/pair/${to}/${from}`);
            clearTimeout(timeOutId);
            hideOverlay();
            const dataTo = await responseTO.json();
        }

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
    }, 500)

})

// при выборе валюты в селекте, значением select.value является строка с значением самой валюты и мы с эти значеием вызываем функцию currRightButtons которая красит кнопки, перезаписывает значение глобальной переменной и даные с сервера записывает вниз инпута с курсом валют 
selectRight.addEventListener('change', (event) => {
    currRightButtons(event.target.value)

})


//******************************************************************************************************************//
//                    Код для левой секции (валюты + инпуты пользовательского ввода)                               //
//                                                                                                                  //
//******************************************************************************************************************//

// Расчитываем значение валюты. Устанавливаем слушатель на поле ввода суммы валюты и дальнейшего пересчёта в другую валюту и вывода итоговой суммы в противоположное поле 

textInputLeft.addEventListener('keyup', (event) => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
        currencyCalculationLeft();
    }, 500)

})

function currencyCalculationLeft() {
    updateValueFromInput(currencyLeft, currencyRight)
        .then((dataObj) => {
            if (textInputLeft.value) {
                let temporary = '';
                temporary = textInputLeft.value * dataObj.dataFrom.toFixed(4);
                textInputRight.value = temporary.toFixed(4);
            }
        })
}

// Инициируем расчёт значения валюты в правом окне. Т.е 1 рубль(значение по умолчанию в левом инпуте) умножаем на курс доллара  и вставляем в правый инпут;
currencyCalculationLeft();

// Расчитываем значение (сумма валюты * на курс) и устанавливаем в нужный инпут.Если раскоменируем строку 129 (textInputLeft.value = temporary.toFixed(4);), тогда в левом инпуте будет автоматически пересчитываться значение.Сейчас знаеие пересчитывается олько в правом инпуте.Левый не меняется.

function currencyCalculationRight() {
    updateValueFromInput(currencyLeft, currencyRight)
        .then((dataObj) => {
            if (textInputRight.value) {
                let temporary = '';
                temporary = textInputRight.value * dataObj.dataTo.toFixed(4);

            }
        })
}




// 


/** Устанавливаем валюту в левом инпуте*/
function currLeftButtons(currency) {
    // Присваиваем глобальной переменной  currencyRight значение валюты из currency
    currencyLeft = currency;
    // Идём по массиву сбрасываем всех в серый цвет
    changeColorBtn(buttonsLeft, selectLeft, currency);

    updateValueFromInput(currencyLeft, currencyRight)
        .then((dataObject) => {
            // console.log(dataObject);
            currentExchangeRateRight.innerText = `1 ${currencyRight} = ${dataObject.dataFrom.toFixed(4)}  ${currencyLeft}`;
            currentExchangeRateLeft.innerText = `1 ${currencyLeft} = ${dataObject.dataTo.toFixed(4)}  ${currencyRight}`;
            textInputRight.value = textInputLeft.value * dataObject.dataFrom.toFixed(4);

        })
}

// ** при выборе валюты в селекте, значением select.value является строка с значением самой валюты и мы с эти значеием вызываем функцию currRightButtons которая красит кнопки, перезаписывает значение глобальной переменной и даные с сервера записывает вниз инпута с курсом валют 
selectLeft.addEventListener('change', (event) => {
    currLeftButtons(event.target.value)

})

buttonsLeft.forEach((item) => {
    item.addEventListener('click', (event) => {
        currLeftButtons(event.target.innerText)
    })
})


// ** При клике на кнопку со стрелками мы меняем местами значение валюты и  в правом инпуте пересчитываем значние*/

arrow.addEventListener('click', (event) => {
    let temporary = currencyLeft;
    currencyLeft = currencyRight;
    currencyRight = temporary;
    currRightButtons(currencyRight);
    currLeftButtons(currencyLeft);
    currencyCalculationLeft();
})


//******************************************************************************************************************//
//                     Получаем список валют из сервера и отрисовываем в селекте на странице                         //
//                                                                                                                  //
//******************************************************************************************************************//
const getFetch = async () => {


    let response = await fetch(`https://v6.exchangerate-api.com/v6/bfe77b8783fe3967098b97cd/latest/EUR`)
    const data = await response.json();
    // console.log("data", data.conversion_rates);
//******************************************************************************************************************//
//                        АРI  бесплатный. Есть ограничения по количеству запросов.                                 //
//                   Создал две учётных записи.Когда лимит запросов на 1 - ой закончится,                           //
//                            будет использована вторая.                                                            //
//******************************************************************************************************************//

    if (data === "undefined"  || data === "null" || data === '') {
        let response = await fetch(`https://v6.exchangerate-api.com/v6/f2f1f6ffad4b333ca7c58737/latest/EUR`)
        const data = await response.json();
    }
    return data.conversion_rates;
}


getFetch()
    .then((data) => {
        let key = Object.keys(data);
        // console.log("data", data, "key", key);
        key.forEach((itemKey) => {
            if (itemKey !== "RUB" && itemKey !== "USD" && itemKey !== "EUR" && itemKey !== "GBP" && itemKey !== "BYR") {
                // console.log(itemKey);
                select.forEach((selectKey) => {
                    selectOption = document.createElement('option');
                    selectOption.innerText = itemKey;
                    selectKey.append(selectOption);
                })
            }
        })
    })

//******************************************************************************************************************//
//                                       Функция устанавливает timeout                                                                //                                            
//                                                                                                                  //
//******************************************************************************************************************//
//******************************************************************************************************************//
//                     Функция устанавливает timeout который срабатывает при отсутсвии интернета.                    //
//      При отсутсвии интернета запросы на сeрвeр преходят в сосояние reject(вместо  fullfield) и ошибка            //
//   падает в catch. Внутри catch наш timeOut ждёт несколько секунд и устанавливает overlay с надписью LOADING      //                                            
//                                                                                                                  //
//******************************************************************************************************************//

function hideOverlay() {
    overlay.classList.remove('overlayIs-open');
    overlay.classList.add('overlay');
    loading.classList.remove('is-active');
}














