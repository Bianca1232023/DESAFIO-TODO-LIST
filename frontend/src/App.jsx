import './App.css'
import { Logo } from './components/Icons'
import Input from './components/Input'
import TasksInfo from './components/TasksInfo'
import TaskItem from './components/TaskItem'
import EmptyState from './components/EmptyState'
import TaskList from './components/TaskList'
import { useEffect } from 'react'
import { useState } from 'react'

function App() {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
      async function fetchData() {
        const response = await fetch("http://localhost:3000/tasks");
        const result = await response.json();
        setTasks(result.tasks);
      }
      fetchData();
    }, []);


  return (
    <>
      <header><Logo className="logo"/></header>
      <main>
        <Input />
        <TasksInfo />
        {/* <TaskItem></TaskItem> */}
        <EmptyState />
        <TaskList />
      </main>
    </>
  )
}

export default App
