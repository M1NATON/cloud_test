const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileController = require('../controllers/fileController')
const multer = require('multer');
const config = require("config");
const upload = multer({ dest: config.get('filePath') });

router.post('/createDir', authMiddleware, fileController.createDir);
router.post('/upload',authMiddleware, upload.single('file'), fileController.uploadFile);
router.get('/', authMiddleware, fileController.getFiles);
router.delete('/:userId/:fileId', authMiddleware, fileController.deleteFile);
router.get('/download/:userId/:fileId', authMiddleware, fileController.downloadFile);


module.exports = router
