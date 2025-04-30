const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/', authController.handleLogin)

router.post('/google', authController.handleGoogleLogin)

router.post('/forgot', authController.handleForget)

router.post('/recover', authController.handleRecover)

router.post('/verify', authController.handleVerifyToken)

router.post('/logout', authController.handleLogout)

router.post('/register', authController.handleRegister);

router.post('/refreshToken', authController.handleRefreshToken);

module.exports = router;