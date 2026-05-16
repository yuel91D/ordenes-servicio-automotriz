const express = require('express');
const router = express.Router();
const itemOrdenController = require('../controllers/itemOrdenController');

router.get('/', itemOrdenController.getAll);
router.get('/:id', itemOrdenController.getById);
router.post('/', itemOrdenController.create);
router.put('/:id', itemOrdenController.update);
router.delete('/:id', itemOrdenController.delete);

module.exports = router;