const router = require('express').Router();
const callController = require('../controllers/call.controller');

router.get('/', callController.handleCreateCall)

module.exports = router;