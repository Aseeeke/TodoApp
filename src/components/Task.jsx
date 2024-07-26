const Task = ({task, makeDone}) => {
    return(
      <>
      <li>
        {task.content + " "}
        {!task.done? <button onClick={makeDone}>Done</button> : null}
        <br/>
        {task.date === null? null : 'Deadline: ' + task.date.slice(0,10)}
        </li>
        
      </>
    )
  }

  export default Task