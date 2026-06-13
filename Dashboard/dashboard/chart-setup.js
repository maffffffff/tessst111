let chart;

export function createChart(labels,data){

    const ctx =
        document
            .getElementById("weatherChart");

    chart = new Chart(ctx, {

        type:"line",

        data:{
            labels,

            datasets:[{
                label:"Температура",

                data,

                tension:0.3
            }]
        }

    });

}

export function updateChart(data){

    chart.data.datasets[0].data =
        data;

    chart.update();

}