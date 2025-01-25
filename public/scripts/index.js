import { calendarChangeBehaviour, bubbleButtonsBehaviour, deleteButtonBehaviour, tasksDragAndDropBehaviour, populateSlotsByDate } from './functions.js'

// Calendar 
const calendar = document.querySelector('input.date')
const today = new Date().toISOString().split('T')[0]
calendar.setAttribute('value', today)
calendarChangeBehaviour(calendar)

// Buttons
const table = document.querySelector('tbody')
const deleteButton = document.querySelector('button.delete')
bubbleButtonsBehaviour(table, deleteButton)
deleteButtonBehaviour(deleteButton)

// Tasks
tasksDragAndDropBehaviour(table)
populateSlotsByDate(today)
