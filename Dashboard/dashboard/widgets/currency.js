export async function updateCurrencyWidget() {

    const currency =
        document.getElementById("currency");

    try {

        const response =
            await fetch(
                "https://open.er-api.com/v6/latest/USD"
            );

        const data =
            await response.json();

        currency.innerHTML = `
            KGS:
            ${data.rates.KGS}
        `;

    }

    catch {

        currency.innerHTML =
            "Нет данных";
    }

}