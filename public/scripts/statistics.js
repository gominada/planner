const endpoint = "http://localhost:8888"


export async function fetchAnalysis() {
    const response = await fetch(`${endpoint}/statistics/analysis`)
    const data = await response.json()
    return data
}

async function loadAnalysis(chart) {
    const tasks = await fetchAnalysis();

    chart.options.plugins.title.text = 'Bubbles popped by date 🫧'

    let data = []
    for (const task of tasks) {
        data.push({ x: task.date, y: task.completed })
    }

    chart.data.datasets[0].data = data;
    chart.update()
}

const canvas = document.querySelector('canvas');

const chart = new Chart(canvas, {
    type: 'line',
    data: {
        datasets: [
            {
                label: 'Bubbles popped 🫧',
            },
        ]
    },
    options: {
        interaction: {
            intersect: false
        },
        plugins: {
            legend: false,
            title: {
                display: true,
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month'
                }
            }
        }
    }
});


loadAnalysis(chart);

