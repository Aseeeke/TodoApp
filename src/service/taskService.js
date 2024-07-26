import axios from 'axios'

const baseURLTasks = 'http://localhost:3001/tasks'
const baseURLDoneTasks = 'http://localhost:3001/doneTasks'

const getAllTasks = async () => {
    const response = await axios.get(baseURLTasks)
    return response.data
}
const getAllDoneTasks = async () => {
    const response = await axios.get(baseURLDoneTasks)
    return response.data
}
const createNewTask = async (content, date) => {
    const task = {content, date, done:false}
    const response = await axios.post(baseURLTasks, task)

    return response.data
}
const doneTask = async (id) => {
    const task = await axios.get(`${baseURLTasks}/${id}`)
    await axios.delete(`${baseURLTasks}/${id}`)
    const newTask = {...task.data, done: true}
    const response = await axios.post(baseURLDoneTasks, newTask)
    return response.data
}
const clearDone = async() => {
    const doneTasks = await getAllDoneTasks()
    doneTasks.forEach(element => {
        axios.delete(`${baseURLDoneTasks}/${element.id}`)
    });
}

export default {getAllTasks, getAllDoneTasks, createNewTask, doneTask, clearDone}