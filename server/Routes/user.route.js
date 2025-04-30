const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userController = require('../controllers/user.controller');

router.post('/edit', upload.single('image'), userController.handleEditInfo)
router.post('/change-password', userController.handleChangePassword)

module.exports = router;