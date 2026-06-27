import { pool } from "../configdb.js";

export async function createTable(){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS Tasks (
            id        SERIAL PRIMARY KEY,
            description TEXT,
            completed VARCHAR(5)
        )
    `);
}

export async function insertTask(Task){
    await pool.query(
        'INSERT INTO Tasks (description, completed) VALUES ($1, $2)',
        [Task.description, Task.completed.toString()]
    );
}

export async function getTask(id) {
    const result = await pool.query('SELECT * FROM Tasks WHERE id = $1', [id]);
    return result.rows[0];
}

export async function getTasks(){
    const result = await pool.query('SELECT * FROM Tasks');
    return result.rows;
}

export async function updateTask(id, description, completed){
    await pool.query(
        'UPDATE Tasks SET description = $1, completed = $2 WHERE id = $3',
        [description, completed.toString(), id]
    );
}

export async function deleteTask(id){
    await pool.query('DELETE FROM Tasks WHERE id = $1', [id]);
}