import './App.css'
import { Logo } from './components/Icons'
import Input from './components/Input'
import TasksInfo from './components/TasksInfo'
import EmptyState from './components/EmptyState'
import TaskList from './components/TaskList'
import { useTasks } from './hooks/useTask'

function App() {
  const {
    tasks,
    newTaskDescription,
    setNewTaskDescription,
    createTask,
    deleteTask,
    toggleTask,
    completedTasks,
    totalTasks
  } = useTasks();

  return (
    <>
      <header><Logo className="logo"/></header>
      <main>
        <Input 
          value={newTaskDescription}
          onChange={setNewTaskDescription}
          onclickCriar={createTask}
        />
        <TasksInfo 
          totalTasks={totalTasks}
          completedTasks={completedTasks}
        />
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskList 
            tasks={tasks}
            onDelete={deleteTask}
            onToggle={toggleTask}
          />
        )}
      </main>
    </>
  )
}

export default App
