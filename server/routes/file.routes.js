const { Router } = require('express');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/auth.middleware');


const router = Router();

router.post('/upload', authMiddleware, fileController.uploadFile);
router.get('/', authMiddleware, fileController.getFiles);
router.delete('/:id', authMiddleware, fileController.deleteFile);

module.exports = router;



