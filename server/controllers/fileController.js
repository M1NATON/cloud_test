const fileService = require('../services/fileService');
const { Pool } = require('pg');
const config = require('config');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').mkdirp; // Используем mkdirp из модуля mkdirp
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Папка, куда будут сохраняться файлы
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()) // Имя файла сохраняется как поле_имя-штамп времени
    }
})

const upload = multer({ storage: storage })

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cloud_test',
    password: '1324',
    port: 5432,
});

class FileController {
    async createDir(req, res) {
        try {
            const { name, type, parent } = req.body;
            console.log('req.user для пути', req.body)
            const file = { name, type, parent, user: req.user.id, path: req.body.name };

            const createdFolder = await fileService.createDir(file);

            if (createdFolder.created) {
                return res.json(file);
            } else {
                return res.status(400).json({ message: createdFolder.message });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getFiles(req, res) {
        try {
            const userId = parseInt(req.user.id); // Преобразуем к целому числу
            const parentId = req.query.parent || null;

            // Запрос файлов из базы данных
            const getFilesQuery = 'SELECT * FROM files WHERE user_id = $1 AND parent_id = $2';
            const { rows } = await pool.query(getFilesQuery, [userId, parentId]);

            return res.json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.file; // Получение файла из запроса
            console.log('Запрос на загрузку файла:', req.file); // Вывод информации о файле из запроса
            console.log('Информация о пользователе:', req.user);
            const parent = await pool.query('SELECT * FROM files WHERE user_id = $1 AND id = $2', [req.user.id, req.body.parent]);
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
            // let disk_space = 10000;
            // if (user.rows[0].used_space + file.size > user.rows[0].disk_space) {
            //     return res.status(400).json({ message: 'There is not enough space on the disk' });
            // }

            // user.rows[0].used_space = user.rows[0].used_space + file.size;

            let path;
            if (parent.rows.length > 0) {
                path = `${config.get('filePath')}\\${user.rows[0].id}\\${parent.rows[0].path}\\${file.originalname}`;
            } else {
                path = `${config.get('filePath')}\\${user.rows[0].id}\\${file.originalname}`;
            }

            const fileExistsQuery = 'SELECT * FROM files WHERE user_id = $1 AND path = $2';
            const fileExists = await pool.query(fileExistsQuery, [req.user.id, path]);

            if (fileExists.rows.length > 0) {
                return res.status(400).json({ message: 'File already exists' });
            }

            console.log('path', path);

// Используем fs для копирования файла
            const fs = require('fs');
            fs.copyFile(file.path, path, async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Upload error" });
                }
                const type = file.originalname.split('.').pop();

                const insertFileQuery = 'INSERT INTO files(name, type, size, path, parent_id, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                const dbFile = await pool.query(insertFileQuery, [file.originalname, type, file.size, parent.rows[0]?.path, parent.rows[0]?._id, req.user.id]);

                await pool.query('UPDATE users SET used_space = $1 WHERE id = $2', [user.rows[0].used_space, req.user.id]);

                res.json(dbFile.rows[0]);
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Upload error" });
        }
    }


    // async uploadFile(req, res) {
    //     try {
    //         console.log('Запрос на загрузку файла:', req.file);
    //         console.log('Информация о пользователе:', req.user);
    //
    //         const file = req.file;
    //         const filePath = path.join(config.get('filePath'), file.originalname);
    //
    //         // Используем fs.createReadStream и fs.createWriteStream для копирования файла
    //         const readStream = fs.createReadStream(file.path);
    //         const writeStream = fs.createWriteStream(filePath);
    //
    //         // Перенаправляем поток чтения в поток записи
    //         readStream.pipe(writeStream);
    //
    //         // Обработка события окончания копирования файла
    //         writeStream.on('finish', () => {
    //             console.log('File saved at:', filePath);
    //             res.json({ success: true, message: 'File uploaded successfully' });
    //         });
    //
    //         // Обработка ошибок копирования файла
    //         writeStream.on('error', (err) => {
    //             console.error('File save error:', err);
    //             res.status(500).json({ message: 'File save error' });
    //         });
    //     } catch (e) {
    //         console.error(e);
    //         return res.status(500).json({ message: "Upload error" });
    //     }
    // }






    // async uploadFile(req, res) {
    //     try {
    //         const file = req.file;
    //         console.log('Запрос на загрузку файла:', req.file);
    //         console.log('Информация о пользователе:', req.user);
    //
    //         const parent = await pool.query('SELECT * FROM files WHERE user_id = $1 AND id = $2', [req.user.id, req.body.parent]);
    //         const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    //
    //         const filePath = parent.rows.length > 0 ?
    //             path.join(config.get('filePath'), String(user.rows[0].id), String(parent.rows[0].path), file.originalname) :
    //             path.join(config.get('filePath'), String(user.rows[0].id), file.originalname);
    //
    //         const fileExistsQuery = 'SELECT * FROM files WHERE user_id = $1 AND path = $2';
    //         const fileExists = await pool.query(fileExistsQuery, [req.user.id, filePath]);
    //
    //         if (fileExists.rows.length > 0) {
    //             return res.status(400).json({ message: 'File already exists' });
    //         }
    //
    //         console.log('filePath', filePath);
    //
    //         await fs.mkdir(path.dirname(filePath), { recursive: true });
    //         await fs.copyFile(file.path, filePath);
    //
    //         const type = file.originalname.split('.').pop();
    //
    //         const insertFileQuery = 'INSERT INTO files(name, type, size, path, parent_id, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    //         const dbFile = await pool.query(insertFileQuery, [file.originalname, type, file.size, parent.rows[0]?.path, parent.rows[0]?._id, req.user.id]);
    //
    //         res.json(dbFile.rows[0]);
    //     } catch (e) {
    //         console.error(e);
    //         return res.status(500).json({ message: "Upload error" });
    //     }
    // }
}

module.exports = new FileController();
