export async function updateWeatherWidget() {

    const weather =
        document.getElementById("weather");

    try {

        const response =
            await fetch(
                "https://api.open-meteo.com/v1/forecast?latitude=42.87&longitude=74.60&current=temperature_2m"
            );

        if(!response.ok){
            throw new Error();
        }

        const data =
            await response.json();

        weather.innerHTML =
            `${data.current.temperature_2m} °C`;

    }

    catch {

        weather.innerHTML =
            "Нет данных";
    }

}