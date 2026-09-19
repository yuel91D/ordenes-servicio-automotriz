const bcrypt = require('bcryptjs');

async function generarHashes() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const vendedorPass = await bcrypt.hash('vendedor123', 10);
  const clientePass = await bcrypt.hash('cliente123', 10);

  console.log('--- HASHES DE PRUEBA ---');
  console.log('Admin (admin123):', adminPass);
  console.log('Vendedor (vendedor123):', vendedorPass);
  console.log('Cliente (cliente123):', clientePass);
}

generarHashes();