import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './startup/database';
import cors from 'cors';

dotenv.config();

//for mysql connection
connectToDatabase().catch((error: Error) => console.error('Error connecting to MySQL: ', error));

const app: Express = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server!');
});

app.post('/api/new-task', (req: Request, res: Response) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO todo (title, description, createdAt, status) VALUES (?, ?, ?, ?)';
    const values = [title, description, new Date(), 'active'];
    connectToDatabase().then((connection: any) => {
        connection.query(query, values, (err: Error, result: any) => {
            if (err) {
                console.error('Error adding task: ' + err.stack);
                return;
            } else {
                console.log('Task added successfully');
                res.send('Task added successfully');
            }
        });
    });
});

app.get('/api/all-tasks', (req: Request, res: Response) => {
    const query = 'SELECT * FROM todo ORDER BY createdAt DESC LIMIT 5';
    connectToDatabase().then((connection: any) => {
        connection.query(query, (err: Error, result: any) => {
            if (err) {
                console.error('Error getting tasks: ' + err.stack);
                return;
            } else {
                console.log('Recent 5 tasks fetched successfully');
                res.send(result);
            }
        });
    });
});

app.post('/api/update-task', (req: Request, res: Response) => {
    const { id, title, description } = req.body;
    const query = 'UPDATE todo SET title = ?, description = ? WHERE id = ?';
    const values = [title, description, id];
    connectToDatabase().then((connection: any) => {
        connection.query(query, values, (err: Error, result: any) => {
            if (err) {
                console.error('Error updating task: ' + err.stack);
                return;
            } else {
                console.log('Task updated successfully');
                res.send('Task updated successfully');
            }
        });
    });
});

app.post('/api/delete-task', (req: Request, res: Response) => {
    const { id } = req.body;
    const query = 'DELETE FROM todo WHERE id = ?';
    const values = [id];
    connectToDatabase().then((connection: any) => {
        connection.query(query, values, (err: Error, result: any) => {
            if (err) {
                console.error('Error deleting task: ' + err.stack);
                return;
            } else {
                console.log('Task deleted successfully');
                res.send('Task deleted successfully');
            }
        });
    });
});

app.put('/api/complete-task', (req: Request, res: Response) => {
    const { id } = req.body;
    const query = 'UPDATE todo SET status = "completed" WHERE id = ?';
    const values = [id];
    connectToDatabase().then((connection: any) => {
        connection.query(query, values, (err: Error, result: any) => {
            if (err) {
                console.error('Error completing task: ' + err.stack);
                return;
            } else {
                console.log('Task completed successfully');
                res.send('Task completed successfully');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`);
});

