import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TasksInfo from '../src/components/TasksInfo/index.tsx';
import TaskItem from '../src/components/TaskItem/index.tsx';
import EmptyState from '../src/components/EmptyState/index.jsx';
import Input from '../src/components/Input/index.tsx';
import { useTasks } from '../src/hooks/useTask.ts';

// ─── helpers ──────────────────────────────────────────────
function makeFetch(data) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

// ─── useTasks hook ────────────────────────────────────────
describe('useTasks hook', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('busca tasks na montagem e popula o estado', async () => {
    const tasks = [
      { id: 1, description: 'Estudar DevOps', completed: 'false' },
      { id: 2, description: 'Fazer deploy',   completed: 'true'  },
    ];
    vi.stubGlobal('fetch', makeFetch({ tasks }));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.tasks).toHaveLength(2));
    expect(result.current.tasks[0].description).toBe('Estudar DevOps');
  });

  it('retorna lista vazia quando API retorna []', async () => {
    vi.stubGlobal('fetch', makeFetch({ tasks: [] }));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.totalTasks).toBe(0));
  });

  it('calcula completedTasks e totalTasks corretamente', async () => {
    const tasks = [
      { id: 1, description: 'A', completed: 'true'  },
      { id: 2, description: 'B', completed: 'false' },
      { id: 3, description: 'C', completed: 'true'  },
    ];
    vi.stubGlobal('fetch', makeFetch({ tasks }));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.completedTasks).toBe(2));
    expect(result.current.totalTasks).toBe(3);
  });

  it('createTask não faz POST quando descrição está vazia', async () => {
    const fetchMock = makeFetch({ tasks: [] });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.tasks).toBeDefined());

    const callsBefore = fetchMock.mock.calls.length;
    await act(async () => { await result.current.createTask(); });

    expect(fetchMock.mock.calls.length).toBe(callsBefore);
  });

  it('createTask faz POST com os dados corretos e re-busca', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tasks: [] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tasks: [{ id: 1, description: 'Nova', completed: 'false' }] }) });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.tasks).toBeDefined());

    act(() => { result.current.setNewTaskDescription('Nova'); });
    await act(async () => { await result.current.createTask(); });

    const [url, options] = fetchMock.mock.calls[1];
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body).description).toBe('Nova');
    expect(JSON.parse(options.body).completed).toBe('false');
    await waitFor(() => expect(result.current.tasks).toHaveLength(1));
  });

  it('toggleTask inverte o campo completed e faz PUT', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tasks: [{ id: 1, description: 'Task', completed: 'false' }] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tasks: [{ id: 1, description: 'Task', completed: 'true' }] }) });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.tasks).toHaveLength(1));

    await act(async () => { await result.current.toggleTask(1, 'Task', 'false'); });

    const [, options] = fetchMock.mock.calls[1];
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body).completed).toBe('true');
  });

  it('deleteTask faz DELETE e remove a task do estado', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tasks: [{ id: 1, description: 'Task', completed: 'false' }] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tasks: [] }) });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.tasks).toHaveLength(1));

    await act(async () => { await result.current.deleteTask(1); });

    const [, options] = fetchMock.mock.calls[1];
    expect(options.method).toBe('DELETE');
    await waitFor(() => expect(result.current.tasks).toHaveLength(0));
  });
});

// ─── TasksInfo ────────────────────────────────────────────
describe('TasksInfo', () => {
  it('exibe o total de tarefas', () => {
    render(<TasksInfo totalTasks={5} completedTasks={3} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('exibe contagem no formato "X de Y"', () => {
    render(<TasksInfo totalTasks={4} completedTasks={2} />);
    expect(screen.getByText('2 de 4')).toBeInTheDocument();
  });

  it('exibe zeros quando não há tarefas', () => {
    render(<TasksInfo totalTasks={0} completedTasks={0} />);
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });
});

// ─── TaskItem ─────────────────────────────────────────────
describe('TaskItem', () => {
  const baseTask = { id: 1, description: 'Estudar Docker', completed: 'false' };
  let onDelete, onToggle;

  beforeEach(() => {
    onDelete = vi.fn();
    onToggle = vi.fn();
  });

  it('renderiza a descrição da task', () => {
    render(<TaskItem task={baseTask} onDelete={onDelete} onToggle={onToggle} />);
    expect(screen.getByText('Estudar Docker')).toBeInTheDocument();
  });

  it('não aplica classe "completed" quando completed === false', () => {
    render(<TaskItem task={baseTask} onDelete={onDelete} onToggle={onToggle} />);
    expect(screen.getByText('Estudar Docker')).not.toHaveClass('completed');
  });

  it('aplica classe "completed" quando completed === true', () => {
    render(<TaskItem task={{ ...baseTask, completed: 'true' }} onDelete={onDelete} onToggle={onToggle} />);
    expect(screen.getByText('Estudar Docker')).toHaveClass('completed');
  });

  it('chama onToggle ao clicar no checkbox', async () => {
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={onDelete} onToggle={onToggle} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('chama onDelete ao clicar no botão excluir', async () => {
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={onDelete} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

// ─── EmptyState ───────────────────────────────────────────
describe('EmptyState', () => {
  it('exibe mensagem quando não há tarefas', () => {
    render(<EmptyState />);
    expect(screen.getByText('Você ainda não tem tarefas')).toBeInTheDocument();
  });
});

// ─── Input ────────────────────────────────────────────────
describe('Input', () => {
  it('renderiza com o placeholder correto', () => {
    render(<Input value="" onChange={vi.fn()} onClickCriar={vi.fn()} />);
    expect(screen.getByPlaceholderText('Adicione uma nova tarefa')).toBeInTheDocument();
  });

  it('chama onChange ao digitar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} onClickCriar={vi.fn()} />);
    await user.type(screen.getByRole('textbox'), 'A');
    expect(onChange).toHaveBeenCalled();
  });

  it('chama onClickCriar ao clicar no botão Criar', async () => {
    const user = userEvent.setup();
    const onClickCriar = vi.fn();
    render(<Input value="Nova task" onChange={vi.fn()} onClickCriar={onClickCriar} />);
    await user.click(screen.getByRole('button', { name: /criar/i }));
    expect(onClickCriar).toHaveBeenCalledTimes(1);
  });

  it('chama onClickCriar ao pressionar Enter', async () => {
    const user = userEvent.setup();
    const onClickCriar = vi.fn();
    render(<Input value="Task" onChange={vi.fn()} onClickCriar={onClickCriar} />);
    await user.type(screen.getByRole('textbox'), '{Enter}');
    expect(onClickCriar).toHaveBeenCalledTimes(1);
  });
});
