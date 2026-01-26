import React from 'react'
import './styles.css'
import TaskItem from '../TaskItem'

const TaskList = () => {
  return (
    <div className="task-list">
        <ul>
            <TaskItem />
        </ul>
    </div>
  )
}

export default TaskList