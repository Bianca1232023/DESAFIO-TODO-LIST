import { jest, describe, test, expect, beforeAll, afterEach } from '@jest/globals';
import request from 'supertest';

// --- mocks do banco (ESM) ---
const mockCreateTable = jest.fn().mockResolvedValue(undefined);
const mockGetTasks    = jest.fn();
const mockGetTask     = jest.fn();
const mockInsertTask  = jest.fn();
const mockUpdateTask  = jest.fn();
const mockDeleteTask  = jest.fn();

jest.unstable_mockModule('../src/controller/task.js', () => ({
    createTable: mockCreateTable,
    getTasks:    mockGetTasks,
    getTask:     mockGetTask,
    insertTask:  mockInsertTask,
    updateTask:  mockUpdateTask,
    deleteTask:  mockDeleteTask,
}));

// importação dinâmica APÓS os mocks estarem registrados
let app;
beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    ({ default: app } = await import('../src/app.js'));
});

afterEach(() => jest.clearAllMocks());

// ─────────────────────────────────────────────
// GET /tasks
// ─────────────────────────────────────────────
describe('GET /tasks', () => {
    test('retorna lista de tasks com statusCode 200', async () => {
        const tasks = [
            { id: 1, description: 'Estudar DevOps', completed: 'false' },
            { id: 2, description: 'Fazer deploy',   completed: 'true'  },
        ];
        mockGetTasks.mockResolvedValue(tasks);

        const res = await request(app).get('/tasks');

        expect(res.status).toBe(200);
        expect(res.body.statusCode).toBe(200);
        expect(res.body.tasks).toEqual(tasks);
        expect(mockGetTasks).toHaveBeenCalledTimes(1);
    });

    test('retorna lista vazia quando não há tasks', async () => {
        mockGetTasks.mockResolvedValue([]);

        const res = await request(app).get('/tasks');

        expect(res.status).toBe(200);
        expect(res.body.tasks).toEqual([]);
    });
});

// ─────────────────────────────────────────────
// POST /task
// ─────────────────────────────────────────────
describe('POST /task', () => {
    test('cria uma task e retorna statusCode 201', async () => {
        mockInsertTask.mockResolvedValue(undefined);

        const res = await request(app)
            .post('/task')
            .send({ description: 'Nova task', completed: 'false' });

        expect(res.status).toBe(200);
        expect(res.body.statusCode).toBe(201);
        expect(res.body.message).toBe('Task created');
        expect(res.body.description).toBe('Nova task');
        expect(mockInsertTask).toHaveBeenCalledWith({
            description: 'Nova task',
            completed: 'false',
        });
    });

    test('retorna os dados corretos quando completed é true', async () => {
        mockInsertTask.mockResolvedValue(undefined);

        const res = await request(app)
            .post('/task')
            .send({ description: 'Task concluída', completed: 'true' });

        expect(res.body.statusCode).toBe(201);
        expect(res.body.description).toBe('Task concluída');
    });
});

// ─────────────────────────────────────────────
// PUT /task/:id
// ─────────────────────────────────────────────
describe('PUT /task/:id', () => {
    test('atualiza task existente e retorna statusCode 200', async () => {
        const existingTask = { id: 1, description: 'Antiga', completed: 'false' };
        mockGetTask.mockResolvedValue(existingTask);
        mockUpdateTask.mockResolvedValue(undefined);

        const res = await request(app)
            .put('/task/1')
            .send({ description: 'Atualizada', completed: 'true' });

        expect(res.status).toBe(200);
        expect(res.body.statusCode).toBe(200);
        expect(res.body.message).toBe('Task 1 updated');
        expect(res.body.description).toBe('Atualizada');
        expect(res.body.completed).toBe('true');
        expect(mockUpdateTask).toHaveBeenCalledWith('1', 'Atualizada', 'true');
    });

    test('retorna 204 quando task não existe', async () => {
        mockGetTask.mockResolvedValue(undefined);

        const res = await request(app)
            .put('/task/999')
            .send({ description: 'X', completed: 'false' });

        expect(res.status).toBe(204);
        expect(mockUpdateTask).not.toHaveBeenCalled();
    });
});

// ─────────────────────────────────────────────
// DELETE /task/:id
// ─────────────────────────────────────────────
describe('DELETE /task/:id', () => {
    test('remove task existente e retorna statusCode 200', async () => {
        const existingTask = { id: 1, description: 'Estudar', completed: 'false' };
        mockGetTask.mockResolvedValue(existingTask);
        mockDeleteTask.mockResolvedValue(undefined);

        const res = await request(app).delete('/task/1');

        expect(res.status).toBe(200);
        expect(res.body.statusCode).toBe(200);
        expect(res.body.message).toBe('Task 1 deleted');
        expect(mockDeleteTask).toHaveBeenCalledWith('1');
    });

    test('retorna 204 quando task não existe', async () => {
        mockGetTask.mockResolvedValue(undefined);

        const res = await request(app).delete('/task/999');

        expect(res.status).toBe(204);
        expect(mockDeleteTask).not.toHaveBeenCalled();
    });
});

// ─────────────────────────────────────────────
// Headers CORS
// ─────────────────────────────────────────────
describe('Headers CORS', () => {
    test('todas as respostas incluem Access-Control-Allow-Origin: *', async () => {
        mockGetTasks.mockResolvedValue([]);

        const res = await request(app).get('/tasks');

        expect(res.headers['access-control-allow-origin']).toBe('*');
    });
});