const endpoint = "http://localhost:8888"

export async function fetchTasksByDate(date) {
    const response = await fetch(`${endpoint}/day?date=${date}`)
    const data = await response.json()
    return data
}


export async function saveOrUpdateTasks(tasks) {
    const response = await fetch(`${endpoint}/day`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks),
    })
    const data = await response.json()
    return data
}

export async function removeTasks(tasks) {
    const response = await fetch(`${endpoint}/day`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks)
    })
    const data = await response.json()
    return data
}