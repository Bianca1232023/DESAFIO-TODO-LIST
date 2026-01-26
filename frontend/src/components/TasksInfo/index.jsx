import React from 'react'
import './styles.css'

const TasksInfo = () => {


  return (
    <div className='task-container'>
        <span className='created-tasks'>Task criadas</span>
        <span className='finished-tasks'>concluidas</span>
    </div>
  )
}

export default TasksInfo