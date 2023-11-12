const path = require('path');
const uuid = require('uuid');
const {Pool} = require("pg");
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cloud_two',
    password: '1324',
    port: 5432,
});

class FileController {
    async uploadFile(req, res) {
        try {
            const file = req.files.file;
            const parent_id = req.query.parent_id;
            const user_id = req.user.userId;
            const type = file.mimetype;
            const size = file.size;
            const name = uuid.v4() + path.extname(file.name);
            const filePath = path.join(__dirname, '..', 'static', name);
            const newFile = await pool.query('INSERT INTO files (name, type, size, path, user_id, parent_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, type, size, name, user_id, parent_id]);

            if (parent_id) {
                await pool.query('UPDATE files SET updated_at = NOW() WHERE id = $1', [parent_id]);
            }

            file.mv(filePath);
            return res.json({ ...newFile.rows[0], path: '/static/' + name });
        } catch (e) {
            console.error('Upload error', e);
            return res.status(500).json({ message: 'Upload error' });
        }
    }

    async getFiles(req, res) {
        try {
            const user_id = req.user.userId;
            const parent_id = req.query.parent_id;

            let files;
            if (parent_id) {
                files = await pool.query('SELECT * FROM files WHERE user_id = $1 AND parent_id = $2', [user_id, parent_id]);
            } else {
                files = await pool.query('SELECT * FROM files WHERE user_id = $1 AND parent_id IS NULL', [user_id]);
            }

            return res.json(files.rows);
        } catch (e) {
            console.error('Get files error', e);
            return res.status(500).json({ message: 'Get files error' });
        }
    }


    async deleteFile(req, res) {
        try {
            const { id } = req.params;

            // Найдите файл или папку в базе данных по id
            const file = await File.findByPk(id);

            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            // Удалите файл или папку из базы данных
            await file.destroy();

            // Дополнительно, удалите связанные файлы с сервера (если это папка, рекурсивно удалите все содержимое)

            return res.json({ message: 'File deleted successfully' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Server error' });
        }
    }


}

module.exports = new FileController();
