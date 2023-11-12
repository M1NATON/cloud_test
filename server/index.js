const express = require('express');
const { Pool } = require('pg');
const config = require('config');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const app = express();
const PORT = process.env.PORT || config.get('serverPort'); // Используем переменную окружения PORT

const corsMiddleware = require('./middleware/cors.middleware');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cloud_two',
    password: '1324',
    port: 5432,
});

app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database');
        await client.release();
        app.listen(PORT, () => {
            console.log('Server started on port', PORT);
        });
    } catch (e) {
        console.error('Database connection error', e);
    }
})();
