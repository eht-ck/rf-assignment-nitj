const express = require('express');
const router = express.Router();
const docController = require('./docController');

router.post('/upload', docController.uploadFile);

module.exports = router;
