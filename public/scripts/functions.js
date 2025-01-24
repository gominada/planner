import { fetchTasksByDate, saveOrUpdateTasks, removeTasks } from './service.js'

/**
 * Adds a Change EventListener to the Calendar HTMLElement.
 * If a change occurs it will clean the Slots and populate them after fetching the data.
 * @param {HTMLElement} calendar 
 */
export function calendarChangeBehaviour(calendar) {
    calendar.addEventListener('change', () => {
        cleanSlots()
        populateSlotsByDate(calendar.value)
    })
}

/**
 * Adds a Click EventListener to Bubble Buttons (inside the table parameter). 
 * The normal behaviour is fetching data and/or saving it.
 * If DeleteButton is active it will instead toggle a Bubble Button CCS class (making it red).
 * @param {HTMLTableElement} table 
 * @param {HTMLButtonElement} deleteButton
 */
export function bubbleButtonsBehaviour(table, deleteButton) {
    table.addEventListener('click', async event => {
        const target = event.target
        if (target.tagName != 'BUTTON') return // Only look for Bubble 🫧 buttons 

        // If the delete button is active then bubble buttons will toggle a CSS class
        // rather than interact with the database (normal behaviour)
        if (deleteButton.classList.contains('active')) {
            target.classList.toggle('to-delete')
            return
        }

        // normal behaviour
        target.classList.toggle('done')

        const tasks = Object.values(document.querySelectorAll('input[type="text"]'))
        await saveOrUpdateTasks(filledTasks(tasks))
        populateSlotsByDate(getCalendarDate())
    })
}

/**
 * Adds a Click EventListener to Delete Button.
 * It will toggle the active class (making it red).
 * If the Delete Button has the active class before the toggle 
 * it will request to delete all the tasks marked by Bubble Buttons 
 * @param {HTMLButtonElement} deleteButton 
 */
export function deleteButtonBehaviour(deleteButton) {
    deleteButton.addEventListener('click', async () => {
        deleteButton.classList.toggle('active')

        if (!deleteButton.classList.contains('active')) {

            const tasksToRemove = Object.values(document.querySelectorAll('input[type="text"]'))
                .filter(form => form.nextElementSibling.classList.contains('to-delete'))

            if (tasksToRemove.length > 0) {
                await removeTasks(filledTasks(tasksToRemove))
                populateSlotsByDate(getCalendarDate())
            }
        }
    })
}

/**
 * Adds Dragstart and DragEnd EventListener to the Table HTMLElement.
 * Adds DragOver EventListener to all the Slots of the table.
 * @param {HTMLTableElement} table 
 */
export function tasksDragAndDropBehaviour(table) {
    const slots = document.querySelectorAll('.slot')

    table.addEventListener('dragstart', event => {
        const target = event.target
        if (!target.classList.contains('draggable')) return

        target.classList.toggle('draggin')
    })

    table.addEventListener('dragend', event => {
        const target = event.target
        if (!target.classList.contains('draggable')) return

        target.classList.toggle('draggin')
    })

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => {
            e.preventDefault()
            const draggable = document.querySelector('.draggin')
            slot.appendChild(draggable)
        })
    })
}

/**
 * Replaces the content of all the Slots with the default content.
 */
function cleanSlots() {
    const slots = document.querySelectorAll('.slot')
    slots.forEach(slot => {
        slot.innerHTML = `
        <div class="task draggable" draggable="true">
            <input type="text">
            <button>✔️</button>
        </div>
        `
    })
}

/**
 * Cleans Table Slots, Fetches Tasks and Adds the tasks to the Slots.
 * @async
 * @param {String} date - A string representing the date (e.g, "2025-01-01")
 * @return {Promise<void>}
 */
export async function populateSlotsByDate(date) {
    cleanSlots()
    const slots = document.querySelectorAll('.slot')
    const tasks = await fetchTasksByDate(date)

    for (const slot of slots) {

        const hour = slot.previousElementSibling.textContent

        // Array of ordered tasks maching the date of the slot
        const orderedTasks = tasks.filter(task => task.hour == hour)
            .sort((a, b) => { return a.position - b.position })

        // Only continue if there are tasks for the given hour
        if (orderedTasks.length) slot.innerHTML = '';
        else continue

        const maxTaskPosition = orderedTasks.slice(-1)[0].position
        const numOfTasks = orderedTasks.length

        // Populate with blank tasks if the max pos is higher than the number of tasks
        for (let i = maxTaskPosition; i > numOfTasks; i--) {
            slot.innerHTML += `
            <div class="task draggable" draggable="true">
                <input type="text">
                <button>✔️</button>
            </div>
        `
        }

        orderedTasks.forEach(task => {
            slot.innerHTML += `
            <div class="task draggable" draggable="true">
                <input type="text" value="${task.name}">
                <button class="${task.done ? 'done' : ''}">✔️</button>
                </div>
            ` }
        )
    }
}


/**
 * @typedef {Object} Task
 * @property {string} name - The name of the task.
 * @property {boolean} done - If the task was completed.
 * @property {string} date - The date in string format of the task.
 * @property {number} hour - The hour of the task.
 * @property {number} position - The position of the task in the time Slot.
 */

/**
 * Retreives an Array with all filled Tasks given an Array of empty/filled tasks
 * @param {Array<HTMLDivElement>} tasks -  All HTMLDivElements that contain the .task class.
 * @return {Array<Task>} filledTasks -  An array of tasks objects 
 */
function filledTasks(tasks) {
    const date = getCalendarDate()

    const filledTasks =
        tasks
            .filter(task => task.value != '')
            .map(task => ({
                name: task.value,
                done: task.nextElementSibling.classList.contains('done') ? true : false,
                date: date,
                hour: Number(task.closest('tr').querySelector('.hour').textContent),
                position: calcPosition(Array.from(task.closest('tr').querySelectorAll('.task')), task),
            }))

    return filledTasks

    /**
     * Calculates the position of the task inside the time Slot 
     * @param {Array<HTMLDivElement>} list - An array of tasks
     * @param {HTMLDivElement} task - A specific task inside the array of tasks
     * @returns {number} position - The position of the task inside the array
     */
    function calcPosition(list, obj) {
        let sum = 0
        for (const item of list) {
            sum += 1
            if (item.offsetLeft === obj.offsetLeft) return sum
        }
    }
}

function getCalendarDate() {
    const calendar = document.querySelector('.date')
    return calendar.value
}

// For future use
// function urlAddParams(date) {
//     let stateObj = { "date": date };
//     window.history.pushState(stateObj, "", `${date}`)
// }