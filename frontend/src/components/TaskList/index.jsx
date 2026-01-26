import React from 'react'
import './styles.css'
import TaskItem from '../TaskItem'

const TaskList = ({ tasks, onDelete, onToggle }) => {
  return (
    <div className="task-list">
        <ul>
          {tasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              onDelete={() => onDelete(task.id)}
              onToggle={() => onToggle(task.id, task.description, task.completed)}
            />
          ))}
        </ul>
    </div>
  )
}

export default TaskList