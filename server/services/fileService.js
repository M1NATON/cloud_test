// const fs = require('fs');
// const { Pool } = require("pg");
// const config = require('config');
// const path = require('path'); // Добавим модуль path для работы с путями
//
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'cloud_test',
//     password: '1324',
//     port: 5432,
// });
//
// class FileService {
//     async createDir(file) {
//         const { name, type, parent, user } = file;
//         const userId = user;
//         const folderPath = path.join(config.get('filePath'), userId.toString(), name);
//
//         try {
//             // Создание папки на сервере
//             if (!fs.existsSync(folderPath)) {
//                 fs.mkdirSync(folderPath, { recursive: true }); // Создание папки и всех необходимых родительских папок
//             } else {
//                 return { message: "Folder already exists" };
//             }
//
//             // Создание записи в базе данных
//             const createFolderQuery = 'INSERT INTO files(name, type, user_id, parent_id) VALUES($1, $2, $3, $4) RETURNING *';
//             const insertedFolder = await pool.query(createFolderQuery, [name, type, userId, parent]);
//
//             return { message: 'Folder was created', folder: insertedFolder.rows[0] };
//         } catch (error) {
//             console.error(error);
//             return { message: 'Folder creation error' };
//         }
//     }
// }
//
// module.exports = new FileService();



// fileService.js
// const fs = require('fs');
// const config = require('config');
//
// class FileService {
//     constructor(pool) {
//         this.pool = pool;
//     }
//
//     async createDir(file) {
//         const filePath = `${config.get('filePath')}/${file.user}/${file.path}`;
//         try {
//             let counter = 1;
//             let newFilePath = filePath;
//             while (fs.existsSync(newFilePath)) {
//                 newFilePath = `${filePath}_${counter}`;
//                 counter++;
//             }
//
//             fs.mkdirSync(newFilePath);
//             file.path = newFilePath.split('/').pop(); // Или какая-то другая логика для получения имени папки
//
//             return { message: 'File was created', folder: file };
//         } catch (error) {
//             console.error(error);
//             return { message: 'File error' };
//         }
//     }
//
//     async saveFileToDB(file) {
//         const createFileQuery = `
//             INSERT INTO files(name, type, user_id, parent_id, path)
//             VALUES($1, $2, $3, $4, $5)
//             RETURNING *`;
//         const values = [file.name, file.type, file.user, file.parent, file.path];
//
//         try {
//             const { rows } = await this.pool.query(createFileQuery, values);
//             return rows[0];
//         } catch (error) {
//             console.error(error);
//             throw new Error("Error saving file to DB");
//         }
//     }
// }
//
// module.exports = FileService;




const { Pool } = require('pg');
const config = require('config');
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cloud_test',
    password: '1324',
    port: 5432,
});

class FileService {
    async createDir(file) {
        try {
            const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`;
            console.log('File path:', filePath); // Проверяем, какой путь формируется
            if (!fs.existsSync(filePath)) {
                console.log('Directory does not exist. Creating directory...');
                fs.mkdirSync(filePath);
                return { message: 'File was created', created: true };
            } else {
                console.log('Directory already exists.');
                return { message: 'File already exists', created: false };
            }
        } catch (error) {
            console.error('Error creating directory:', error);
            return { message: 'File error', created: false };
        }
    }


    // async saveFileToDB(fileInfo) {
    //     try {
    //         const insertFileQuery = 'INSERT INTO files(name, type, size, path, parent_id, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    //         const values = [
    //             fileInfo.name,
    //             fileInfo.type,
    //             fileInfo.size,
    //             fileInfo.path,
    //             fileInfo.parent,
    //             fileInfo.user,
    //         ];
    //
    //         const dbFile = await pool.query(insertFileQuery, values);
    //
    //         return dbFile.rows[0];
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error('Error saving file to database');
    //     }
    // }
}

module.exports = new FileService();

