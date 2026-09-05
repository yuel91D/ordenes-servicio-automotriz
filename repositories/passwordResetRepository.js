const { PasswordReset } = require('../models');

const passwordResetRepository = {
  create: async (data) => await PasswordReset.create(data),
  findOne: async (email) => await PasswordReset.findOne({ where: { email } })
};
module.exports = passwordResetRepository;