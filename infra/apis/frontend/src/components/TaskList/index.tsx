import React from 'react'
import './styles.css'
import TaskItem from '../TaskItem'

interface Task {
    id: number;
    description: string;
    completed: string;
}
interface TaskListProps {
  "tasks": Task[];
  "onDelete": (id: number) => void;
  "onToggle": (id: number, description: string, completed: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onToggle }) => {
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