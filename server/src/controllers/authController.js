const authService = require('../services/authService');

const adminLogin = (req, res, next) => {
  try {
    const { storeIdentifier, username, password } = req.body;
    const result = authService.loginAdmin(storeIdentifier, username, password, req.ip);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

const tableLogin = (req, res, next) => {
  try {
    const { storeIdentifier, tableNumber, password } = req.body;
    const result = authService.loginTable(storeIdentifier, tableNumber, password, req.ip);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

const verify = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ data: { valid: false, error: 'NO_TOKEN' } });
    }
    const token = authHeader.slice(7);
    const result = authService.verifyToken(token);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { adminLogin, tableLogin, verify };
