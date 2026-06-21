const sequelize = require('../src/config/database');
const Usuario = require('../src/models/usuario');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ alter: true });

    const passwordCifrada = await bcrypt.hash('admin123', 10);

    const [user, created] = await Usuario.findOrCreate({
      where: { email: 'admin@taller.com' },
      defaults: {
        password: passwordCifrada,
        rol: 'admin'
      }
    });

    if (created) {
      console.log('✅ Usuario Administrador creado exitosamente.');
    } else {
      console.log('ℹ️ El usuario Administrador ya existe.');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error al crear el seed:', error);
    process.exit(1);
  }
}

seed();