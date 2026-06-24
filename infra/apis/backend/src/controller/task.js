import { openDb } from "../configdb.js";

export async function createTable(){
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, completed VARCHAR(5))');
    });
}

export async function insertTask(Task){
    openDb().then(db=>{
        db.run('INSERT INTO Tasks (description, completed) VALUES (?, ?)', [Task.description, Task.completed.toString()]);
    });
}

export async function getTask(id) {
    return openDb().then(db=>{
        return db.get('SELECT * FROM Tasks WHERE id = ?', [id]);
    });
}

export async function getTasks(){
    return openDb().then(db=>{
        return db.all('SELECT * FROM Tasks');
    });
}

export async function updateTask(id, description, completed){
    openDb().then(db=>{
        db.run('UPDATE Tasks SET description = ?, completed = ? WHERE id = ?', [description, completed.toString(), id]);
    });
}

export async function deleteTask(id){
    openDb().then(db=>{
        db.run('DELETE FROM Tasks WHERE id = ?', [id]);
    });
}