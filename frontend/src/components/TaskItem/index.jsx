import React from 'react'
import './styles.css'
import ButtonDelete from '../DeleteButton'
import CheckBox from '../CheckBox'

const TaskItem = () => {
  return (
    <li className="task-item">
      <div className="task-left">
        <CheckBox />
        <span className="description-list">
          teste aaaaaaaaaaa
        </span>
      </div>

      <ButtonDelete />
    </li>
  )
}


export default TaskItem