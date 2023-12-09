const express = require("express");
const { Pool } = require("pg");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const app = express();
const PORT = config.get('serverPort');
const corsMiddleware = require('./middleware/cors.middleware');
const cors = require('cors');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cloud_test',
    password: '1324',
    port: 5432,
});


app.use(cors());
app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

app.listen(PORT, () => {
    console.log('Server started on port ', PORT);
});
