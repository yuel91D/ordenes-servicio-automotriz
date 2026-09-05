const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwordResetController');
const validarMiddleware = require('../middlewares/validarMiddleware');
const { password_reset } = require('../utils/validators/esquemas');

router.post('/request', validarMiddleware(password_reset), controller.requestReset);

module.exports = router;