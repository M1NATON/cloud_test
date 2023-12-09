const fileService = require('../services/fileService');
const { Pool } = require('pg');
const config = require('config');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').mkdirp; // Используем mkdirp из модуля mkdirp
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/') // Папка, куда будут сохраняться файлы
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now()) // Имя файла сохраняется как поле_имя-штамп времени
//     }
// })

const cleanFileName = (filename) => {
    // Удалить недопустимые символы из имени файла
    return filename.replace(/[<>:"/\\|?*]/g, '_');
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = `uploads/${req.user.id}`;
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const encodedFilename = encodeURIComponent(cleanFileName(file.originalname) + '-' + Date.now());
        cb(null, encodedFilename);
    }
});


const upload = multer({ storage: storage });


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
            const {name, type, parent} = req.body;
            const userId = parseInt(req.user.id);
            const file = { name, type, parent, userId: req.user.id, path: req.body.name };
            const createDirBd = 'INSERT INTO files(name, type, user_id) VALUES($1, $2, $3) RETURNING *'
            const createdFolder = await fileService.createDir(file);
            const  a  = await pool.query(createDirBd, [name, type, userId]);
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
            const getFilesQuery = 'SELECT * FROM files WHERE user_id = $1';
            const { rows } = await pool.query(getFilesQuery, [userId]);

            return res.json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // async deleteFile(req, res) {
    //     try {
    //         const fileId = req.params.fileId;
    //         const userId = req.user.id;
    //         console.log(fileId, 'fileId')
    //         console.log(userId, 'userId')
    //         // Проверяем, существует ли файл
    //         const fileQuery = 'SELECT * FROM files WHERE id = $1 AND user_id = $2';
    //         const fileResult = await pool.query(fileQuery, [fileId, userId]);
    //
    //         if (fileResult.rows.length === 0) {
    //             return res.status(404).json({ message: 'File not found' });
    //         }
    //
    //         const filePath = `${config.get('filePath')}/${userId}/${fileResult.rows[0].path}`;
    //         try {
    //             fs.unlinkSync(filePath);
    //             console.log('Файл успешно удалён.');
    //         } catch (error) {
    //             console.error('Ошибка при удалении файла:', error);
    //         }
    //         // Удаляем запись файла из базы данных
    //         const deleteFileQuery = 'DELETE FROM files WHERE id = $1 AND user_id = $2 RETURNING *';
    //         const deletedFile = await pool.query(deleteFileQuery, [fileId, userId]);
    //
    //         // Удаляем файл из директории
    //         fs.unlink(filePath, (err) => {
    //             if (err) {
    //                 console.error(err);
    //                 return res.status(500).json({ message: 'Error deleting file' });
    //             }
    //             return res.json({ message: 'File deleted successfully' });
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: 'Server error' });
    //     }
    // }

    async deleteFile(req, res) {
        try {
            const fileId = req.params.fileId;
            const userId = req.user.id;

            // Получаем информацию о файле по его ID
            const fileQuery = 'SELECT * FROM files WHERE id = $1 AND user_id = $2';
            const fileResult = await pool.query(fileQuery, [fileId, userId]);

            if (fileResult.rows.length === 0) {
                return res.status(404).json({ message: 'File not found' });
            }

            const fileName = fileResult.rows[0].name; // Получаем имя файла из базы данных
            console.log(fileResult.rows[0].name, 'fileResult.rows[0].name')
            // Формируем путь к файлу на основе базовой директории и имени файла
            const basePath = 'C:\\Users\\User\\Desktop\\HLAM\\testik\\server\\uploads';
            const filePath = `${basePath}/${userId}/${fileName}`;

            // Удаляем файл
            try {
                fs.unlinkSync(filePath);

                // Удаляем запись о файле из базы данных
                const deleteFileQuery = 'DELETE FROM files WHERE id = $1 AND user_id = $2 RETURNING *';
                const deletedFile = await pool.query(deleteFileQuery, [fileId, userId]);

                return res.json({ message: 'File deleted successfully' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error deleting file or file record' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }





    async uploadFile(req, res) {
        try {
            const file = req.file; // Получение файла из запроса
            console.log('Запрос на загрузку файла:', req.file); // Вывод информации о файле из запроса
            console.log('Информация о пользователе:', req.user);
            console.log('Received filename:', decodeURIComponent(req.file.originalname));

            const parent = await pool.query('SELECT * FROM files WHERE user_id = $1 AND id = $2', [req.user.id, req.body.parent]);
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
            // let disk_space = 10000;
            // if (user.rows[0].used_space + file.size > user.rows[0].disk_space) {
            //     return res.status(400).json({ message: 'There is not enough space on the disk' });
            // }

            // user.rows[0].used_space = user.rows[0].used_space + file.size;

            let path;
            if (parent.rows.length > 0) {
                path = `${config.get('filePath')}\\${user.rows[0].id}\\${parent.rows[0].path}\\${decodeURIComponent(file.originalname)}`;
            } else {
                path = `${config.get('filePath')}\\${user.rows[0].id}\\${decodeURIComponent(file.originalname)}`;
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
                const type = decodeURIComponent(file.originalname).split('.').pop();

                const insertFileQuery = 'INSERT INTO files(name, type, size, path, parent_id, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                const dbFile = await pool.query(insertFileQuery, [decodeURIComponent(file.originalname), type, file.size, parent.rows[0]?.path, parent.rows[0]?._id, req.user.id]);

                await pool.query('UPDATE users SET used_space = $1 WHERE id = $2', [user.rows[0].used_space, req.user.id]);

                res.json(dbFile.rows[0]);
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: "Upload error" });
        }
    }




}

module.exports = new FileController();
