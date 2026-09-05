const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const validarMiddleware = require('../middlewares/validarMiddleware');
const { rol } = require('../utils/validators/esquemas');

router.get('/', rolController.getAll);
router.post('/', validarMiddleware(rol), rolController.create);

module.exports = router;