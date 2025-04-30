const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const groupController = require('../controllers/group.controller');

router.post('/create', upload.single('image'), groupController.handleCreateGroup)

router.put('/edit/:id', upload.single('image'), groupController.handleEditGroup)

router.get('/findUser', groupController.handleFindUser)

router.get('/owned', groupController.handleGetGroups)

router.put('/leave/:cid', groupController.handleLeaveGroup)

router.delete('/:cid', groupController.handleDeleteGroup)

module.exports = router;