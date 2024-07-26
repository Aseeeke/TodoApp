import { useState, useEffect } from 'react'
import taskService from './service/taskService'
import Task from './components/Task';

function App() {
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  const [setDeadline, setSetDeadline] = useState(false)

  const [taskName, setTaskName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    taskService.getAllDoneTasks().then(response => {setDoneTasks(response)})

    const sortedTasks = taskService.getAllTasks().then(response => {
      const sortedData = response.sort((a,b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        const referenceDate = new Date();
        const diffA = Math.abs(dateA - referenceDate);
        const diffB = Math.abs(dateB - referenceDate);

        return diffA - diffB;
      })
      setTasks(sortedData)
    })
  }, [tasks])

  const handleSubmit = (event) => {
    event.preventDefault()
    const referenceDate = new Date()
    if(setDeadline) {
      taskService.createNewTask(taskName, date).then(task => {setTasks(tasks.concat(task))})
    }
    else {
      taskService.createNewTask(taskName, null).then(task => {setTasks(tasks.concat(task))})
    }
    console.log(date)
    setTaskName('')
    setDate(new Date())
  }
  const handleChange = (event) => {
    event.preventDefault()
    setTaskName(event.target.value)
  }
  const handleDateChange = (event) => {
    event.preventDefault() 
    const localDate = new Date(event.target.value)
    setDate(localDate)
  }

  const makeDone = async (id) => {
    await taskService.doneTask(id)
    setTasks(await taskService.getAllTasks()) 
    setDoneTasks(await taskService.getAllDoneTasks()) 
  }
  const handleClear = (e) => {
    e.preventDefault()
    taskService.clearDone()
    setDoneTasks([])
    setShowAll(!showAll)
  }

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]
  };

  return (
    <>
    <h1>To-do List</h1>
    <div>
    <form onSubmit={handleSubmit}> 
      <input type='text' value={taskName} onChange={handleChange} placeholder='type your task here'></input>
      {setDeadline? <input type='date' value={date.toISOString().split('T')[0]} min={getMinDateTime()} onChange={handleDateChange}></input>: null }
      <button type ='button' onClick={() => {setSetDeadline(!setDeadline)}}>{setDeadline? 'Hide deadline' : 'Add deadline'}</button>
      <button type='submit'>Add task</button>
    </form>
    <div>
      {tasks.map(
        task => (
          <Task task ={task} key={task.id} makeDone={() => makeDone(task.id)}/>
        )
      )}
      {doneTasks.length !== 0 ? <button onClick={() => {setShowAll(!showAll)}}>{showAll ? 'Hide done tasks' : 'Show done tasks'}</button> : null}
      {
        showAll ? doneTasks.map(
          task => (
            <Task task ={task} key={task.id} makeDone={() => makeDone(task.id)}/>
          )
        ) : null
      }
      {
        showAll && doneTasks.length !== 0 ? <button onClick={handleClear}>Clear done tasks</button> : null
      }
    </div>
    </div>
    </>
  )
}

export default App
