const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.get('/auth', authController.checkAuth);

module.exports = router;
