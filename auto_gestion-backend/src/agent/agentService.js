const { GoogleGenAI } = require('@google/genai');
const { agentToolsDeclaration, toolExecutors } = require('./tools.js');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Eres "AutoIA", el asistente inteligente virtual de gestión de taller mecánico y órdenes de servicio técnico.
Tu objetivo es ayudar a recepcionistas, técnicos y gerentes a automatizar tareas complejas, responder consultas y ejecutar acciones operativas de forma precisa, clara y altamente profesional.

Reglas de Comportamiento:
1. SIEMPRE utiliza las herramientas/funciones disponibles cuando necesites obtener información real de la base de datos o realizar cambios en el sistema. NO inventes IDs, clientes, ni datos de vehículos.
2. Si el usuario te pide crear una orden pero no tienes el ID del cliente o del vehículo, usa primero la herramienta 'buscarCliente' o 'listarVehiculosCliente'.
3. Ante solicitudes ambiguas, razona internamente, consulta los datos necesarios y, si persiste la duda, realiza preguntas directas y cortas al usuario.
4. Siempre entrega respuestas completas, bien estructuradas (utiliza listas, negritas, resúmenes), profesionales y amables.
5. Al confirmar la creación o modificación de un registro, incluye un resumen claro con los datos clave (IDs, Placa, Estado, Fechas).
`;

async function ejecutarAgente({ prompt, historial = [] }) {
  try {
    const model = 'gemini-3.6-flash';
    const contents = [...historial, { role: 'user', parts: [{ text: prompt }] }];

    let respuestaFinal = '';
    let ejecutoHerramientas = [];

    let response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: agentToolsDeclaration }],
        temperature: 0.2
      }
    });

    while (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const toolName = call.name;
      const toolArgs = call.args;

      console.log(`🤖 [Agente IA] Ejecutando herramienta: ${toolName} con argumentos:`, toolArgs);

      if (!toolExecutors[toolName]) {
        throw new Error(`La herramienta ${toolName} no tiene un ejecutor definido.`);
      }

      const resultadoHerramienta = await toolExecutors[toolName](toolArgs);
      ejecutoHerramientas.push({ herramienta: toolName, parametros: toolArgs, resultado: resultadoHerramienta });

      contents.push(response.candidates[0].content);
      contents.push({
        role: 'user',
        parts: [{
          functionResponse: {
            name: toolName,
            response: resultadoHerramienta
          }
        }]
      });

      response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: agentToolsDeclaration }],
          temperature: 0.2
        }
      });
    }

    respuestaFinal = response.text;

    return {
      success: true,
      respuesta: respuestaFinal,
      accionesRealizadas: ejecutoHerramientas
    };

  } catch (error) {
    console.error('❌ Error en el Agente de IA:', error);
    return {
      success: false,
      error: 'Ocurrió un error al procesar la solicitud con el Agente de IA.',
      detalles: error.message
    };
  }
}

module.exports = { ejecutarAgente };