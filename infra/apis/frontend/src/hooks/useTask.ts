import { useState, useEffect, useCallback } from 'react';

interface Task {
  id: number;
  description: string;
  completed: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const API = import.meta.env.VITE_API_URL ?? '';

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API}/tasks`);
      const result = await response.json();
      setTasks(result.tasks || []);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createTask() {
    if (!newTaskDescription.trim()) return;

    try {
      const response = await fetch(`${API}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newTaskDescription,
          completed: 'false'
        })
      });

      if (response.ok) {
        setNewTaskDescription('');
        await fetchTasks();
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  }

  async function toggleTask(id: number, description: string, completed: string) {
    try {
      const response = await fetch(`${API}/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          completed: completed === 'true' ? 'false' : 'true'
        })
      });
      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  }

  async function deleteTask(id: number) {
    try {
      const response = await fetch(`${API}/task/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  }

  const completedTasks = tasks.filter(task => task.completed === 'true').length;

  return {
    tasks,
    newTaskDescription,
    setNewTaskDescription,
    createTask,
    toggleTask,
    deleteTask,
    completedTasks,
    totalTasks: tasks.length,
  };
}

