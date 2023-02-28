const bcrypt = require('bcrypt');

exports.hashPassword = async (req, res, next) => {
  const salt = await bcrypt.genSalt();
  req.body.password = await bcrypt.hash(req.body.password, salt);
  next();
};
