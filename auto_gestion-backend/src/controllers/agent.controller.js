const { ejecutarAgente } = require('../agent/agentService.js');

async function atenderConsultaAgente(req, res) {
  try {
    const { prompt, historial } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        mensaje: 'El parámetro "prompt" es requerido.'
      });
    }

    const resultado = await ejecutarAgente({ prompt, historial });

    if (!resultado.success) {
      return res.status(500).json(resultado);
    }

    return res.status(200).json({
      success: true,
      data: {
        respuesta: resultado.respuesta,
        accionesRealizadas: resultado.accionesRealizadas
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor en el módulo de Agente IA.',
      error: error.message
    });
  }
}

module.exports = { atenderConsultaAgente };