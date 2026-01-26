import React from 'react'
import './styles.css'
import ButtonDelete from '../DeleteButton'
import CheckBox from '../CheckBox'

const TaskItem = ({ task, onDelete, onToggle }) => {
  const isCompleted = task.completed === 'true';

  return (
    <li className="task-item">
      <div className="task-left">
        <CheckBox 
          checked={isCompleted}
          onChange={onToggle}
        />
        <span className={`description-list ${isCompleted ? 'completed' : ''}`}>
          {task.description}
        </span>
      </div>

      <ButtonDelete onClickDelete={onDelete} />
    </li>
  )
}

export default TaskItem