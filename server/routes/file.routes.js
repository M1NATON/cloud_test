const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileController = require('../controllers/fileController')
const multer = require('multer');
const config = require("config");
const upload = multer({ dest: config.get('filePath') });

router.post('', authMiddleware, fileController.createDir)
router.post('/upload',authMiddleware, upload.single('file'), fileController.uploadFile);
router.get('', authMiddleware, fileController.getFiles)


module.exports = router
