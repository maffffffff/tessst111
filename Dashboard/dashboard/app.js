import {
    updateWeatherWidget
}
from "./widgets/weather.js";

import {
    updateCurrencyWidget
}
from "./widgets/currency.js";

import {
    updateNewsWidget
}
from "./widgets/news.js";

import {
    startClock
}
from "./widgets/clock.js";

async function updateAll(){

    await Promise.all([

        updateWeatherWidget(),
        updateCurrencyWidget(),
        updateNewsWidget()

    ]);

}

window.addEventListener("load", async()=>{

    startClock();

    await updateAll();

    setInterval(
        updateAll,
        60000
    );

});