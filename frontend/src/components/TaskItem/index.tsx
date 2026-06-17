import React from 'react'
import './styles.css'
import ButtonDelete from '../DeleteButton'
import CheckBox from '../CheckBox'

interface Task {
  "id": number;
  "description": string;
  "completed": string;
}

interface TaskItemProps {
  "task": Task;
  "onDelete": () => void;
  "onToggle": () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggle }) => {
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