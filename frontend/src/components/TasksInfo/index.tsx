import React from 'react'
import './styles.css'

interface TasksInfoProps {
  totalTasks: number;
  completedTasks: number;
}

const TasksInfo: React.FC<TasksInfoProps> = ({ totalTasks, completedTasks }) => {
  return (
    <div className='task-container'>
        <span className='created-tasks'>Tarefas criadas <span className='badge'>{totalTasks}</span></span>
        <span className='finished-tasks'>Concluídas <span className='badge'>{completedTasks} de {totalTasks}</span></span>
    </div>
  )
}

export default TasksInfo