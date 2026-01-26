//import { openDb } from './configdb.js';

import express from 'express';
import {createTable , getTasks, getTask ,insertTask, updateTask , deleteTask} from './controller/task.js';

createTable();

const app = express();
const port = 3000;

// Configuração de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

app.get ('/tasks', async (req, res) => {
    const tasks = await getTasks();
    res.json({ "statusCode": 200, "tasks": tasks });
});

app.post('/task', async(req, res) => {
    const {description, completed} = req.body;
    const task = await insertTask({ description, completed });
    res.json({ "statusCode": 201, "message": "Task created", "description": description});
});

app.put('/task/:id', async (req, res) => {
    
    const { id } = req.params;
    const { description, completed } = req.body;
    const task = await getTask(id);
    console.log(task);

    if(!task){
        return res.status(204).json({ "statusCode": 404, "message": `Task ${id} not found`});
    }

    if(req.body && !id){
        return res.status(400).json({ "statusCode": 400, "message": "Task id is required"});
    } else {
        updateTask(id, description, completed);
        res.json({ "statusCode": 200, "message": `Task ${id} updated`, "description": description, "completed": completed });
    }
});

app.delete('/task/:id', async(req, res) => {
    const { id } = req.params;
    const task = await getTask(id);

    if(!task){
        return res.status(204).json({ "statusCode": 404, "message": `Task ${id} not found`});
    }

    deleteTask(id);
    res.json({ "statusCode": 200, "message": `Task ${id} deleted` });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
