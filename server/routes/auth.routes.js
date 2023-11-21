const Router = require("express");
const { Pool } = require("pg");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const router = new Router();
const fs = require('fs')

const authMiddleware = require('../middleware/auth.middleware');
const fileService = require('../services/fileService')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cloud_test',
    password: '1324',
    port: 5432,
});

router.post('/registration',
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
    ],
    // async (req, res) => {
    //     try {
    //         const errors = validationResult(req)
    //         if (!errors.isEmpty()) {
    //             return res.status(400).json({message: "Uncorrect request", errors})
    //         }
    //         const {email, password} = req.body
    //         const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    //         const userExists = await pool.query(checkUserQuery, [email]);
    //         if(userExists.rows.length > 0) {
    //             return res.status(400).json({message: `User with email ${email} already exists`})
    //         }
    //         const hashPassword = await bcrypt.hash(password, 8);
    //         const insertUserQuery = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *';
    //         const insertedUser = await pool.query(insertUserQuery, [email, hashPassword]);
    //         await pool.query('INSERT INTO files(user_id, name, type, path) VALUES($1, $2, $3, $4)', [insertedUser.rows[0].id, email, 'dirname', fileService.createDir(new File({user:user.id, name: ''}))]); // Create file entry for user
    //         res.json({message: "User was created"});
    //     } catch (e) {
    //         console.log(e);
    //         // res.send({message: "Server error123"});
    //     }
    // });

    // async (req, res) => {
    //     try {
    //         const errors = validationResult(req);
    //         if (!errors.isEmpty()) {
    //             return res.status(400).json({ message: "Uncorrect request", errors });
    //         }
    //         const { email, password } = req.body;
    //
    //         // Проверяем, существует ли пользователь с таким email
    //         const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    //         const userExists = await pool.query(checkUserQuery, [email]);
    //
    //         if (userExists.rows.length > 0) {
    //             return res.status(400).json({ message: `User with email ${email} already exists` });
    //         }
    //
    //         // Хэшируем пароль
    //         const hashPassword = await bcrypt.hash(password, 8);
    //
    //         // Вставляем нового пользователя в таблицу users
    //         const insertUserQuery = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *';
    //         const insertedUser = await pool.query(insertUserQuery, [email, hashPassword]);
    //
    //         // Создаем запись о файле для пользователя в таблице files
    //         const fileName = email; // Укажите имя файла, которое вы хотите создать
    //         const fileType = 'dirname'; // Укажите тип файла (например, директория)
    //         const filePath = `${config.get('filePath')}\\${email}`; // Укажите путь для файла
    //         const createFileQuery = 'INSERT INTO files(user_id, name, type, path) VALUES($1, $2, $3, $4)';
    //         await pool.query(createFileQuery, [insertedUser.rows[0].id, fileName, fileType, filePath]);
    //
    //         res.json({ message: "User was created" });
    //     } catch (e) {
    //         console.error(e);
    //         // res.status(500).send({ message: "Server error" });
    //     }
    // });



    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Uncorrect request", errors });
            }
            const { email, password } = req.body;

            // Проверяем, существует ли пользователь с таким email
            const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
            const userExists = await pool.query(checkUserQuery, [email]);

            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: `User with email ${email} already exists` });
            }

            // Хэшируем пароль
            const hashPassword = await bcrypt.hash(password, 8);

            // Вставляем нового пользователя в таблицу users
            const insertUserQuery = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *';
            const insertedUser = await pool.query(insertUserQuery, [email, hashPassword]);

            // Получаем путь для создания папки из базы данных или генерируем его
            const userFilePathQuery = 'SELECT path FROM files WHERE user_id = $1';
            const userFilePathResult = await pool.query(userFilePathQuery, [insertedUser.rows[0].id]);
            const userFilePath = userFilePathResult.rows.length > 0 ? userFilePathResult.rows[0].path : ''; // Задайте путь по умолчанию


            // Создаем папку в соответствии с путем
            const folderPath = `${config.get('filePath')}/${insertedUser.rows[0].id}`; // Путь, по которому вы хотите создать папку
            fs.mkdirSync(folderPath, { recursive: true });

            res.json({ message: "User was created" });
        } catch (e) {
            console.error(e);
            // res.status(500).send({ message: "Server error" });
        }
    });




router.post('/login',
    async (req, res) => {
        try {
            const { email, password } = req.body;

            const userQuery = 'SELECT * FROM users WHERE email = $1';
            const userData = await pool.query(userQuery, [email]);

            if (userData.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = userData.rows[0];
            const isPassValid = await bcrypt.compare(password, user.password);

            if (!isPassValid) {
                return res.status(400).json({ message: "Invalid password" });
            }

            const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" });
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Server error" });
        }
    }
);

router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            const userQuery = 'SELECT * FROM users WHERE id = $1';
            const userData = await pool.query(userQuery, [req.user.id]);
            console.log('req.user в файле auth.routes')
            console.log(req.user)
            if (userData.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = userData.rows[0];
            const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" });

            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;