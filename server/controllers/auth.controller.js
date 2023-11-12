const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Pool } = require("pg");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cloud_two',
    password: '1324',
    port: 5432,
});

class AuthController {
    async registration(req, res) {
        try {
            const { username, email, password } = req.body;
            const candidate = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (candidate.rows.length) {
                return res.status(400).json({ message: `User with username ${username} already exists` });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);

            if (!newUser.rows || newUser.rows.length === 0) {
                return res.status(500).json({ message: 'User creation failed' });
            }

            const user = newUser.rows[0];
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || config.get('secretKey'), { expiresIn: '24h' });

            return res.json({ token, user: { id: user.id, username: user.username } });
        } catch (e) {
            console.error('Registration error', e);
            return res.status(500).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (!user.rows.length) {
                return res.status(400).json({ message: 'User not found' });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.rows[0].password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET || config.get('secretKey'), { expiresIn: '24h' });
            console.log(`Login token ${token}`)
            // В вашем контроллере на сервере
            return res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });

        } catch (e) {
            console.error('Login error', e);
            return res.status(500).json({ message: 'Login error' });
        }
    }

    async checkAuth(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            console.log(`Auth token ${token}`)

            if (!token) {
                return res.status(401).json({ message: 'Auth error - no token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || config.get('secretKey'));
            console.log(`decoded auth ${decoded.userId}`)
            return res.json({ message: 'Auth successful', userId: decoded.userId });
        } catch (e) {
            console.error('Auth error', e);
            return res.status(401).json({ message: 'Auth error - invalid token' });
        }
    }
}

module.exports = new AuthController();
