const express = require('express');
const router = express.Router();
const uploadControl = require('../controllers/uploadControllers');
const upload = require('../service/image'); // middleware
const { isAuth } = require('../service/auth');
const handleErrorAsync = require("../service/handleErrorAsync");

router.post('/', isAuth,upload, handleErrorAsync(uploadControl.postUpload));

module.exports = router;