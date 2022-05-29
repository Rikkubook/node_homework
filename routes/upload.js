const express = require('express');
const router = express.Router();
const uploadControl = require('../controllers/uploadControllers');
const upload = require('../service/image'); // middleware
const { isAuth } = require('../service/auth');

router.post('/', isAuth,upload, uploadControl.postUpload);

module.exports = router;