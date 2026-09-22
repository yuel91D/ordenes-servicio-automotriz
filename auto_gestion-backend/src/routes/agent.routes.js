const { Router } = require('express');
const { atenderConsultaAgente } = require('../controllers/agent.controller.js');

const router = Router();

// Endpoint del Agente IA
router.post('/agente/atender', atenderConsultaAgente);

module.exports = router;