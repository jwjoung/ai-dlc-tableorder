const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const adminRepository = require('../repositories/adminRepository');
const { AppError } = require('../middleware/errorHandler');
const { recordFailedAttempt, clearFailedAttempts } = require('../middleware/rateLimiter');

class AuthService {
  loginAdmin(storeIdentifier, username, password, ip) {
    const store = adminRepository.findStoreByIdentifier(storeIdentifier);
    if (!store) {
      if (ip) recordFailedAttempt(ip);
      throw new AppError('매장을 찾을 수 없습니다', 401, 'UNAUTHORIZED');
    }

    const admin = adminRepository.findByStoreAndUsername(store.id, username);
    if (!admin) {
      if (ip) recordFailedAttempt(ip);
      throw new AppError('아이디 또는 비밀번호가 일치하지 않습니다', 401, 'UNAUTHORIZED');
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    if (!isValid) {
      if (ip) recordFailedAttempt(ip);
      throw new AppError('아이디 또는 비밀번호가 일치하지 않습니다', 401, 'UNAUTHORIZED');
    }

    if (ip) clearFailedAttempts(ip);

    const token = jwt.sign(
      { id: admin.id, storeId: store.id, username: admin.username, role: 'admin' },
      config.jwtSecret,
      { expiresIn: '16h' }
    );

    return {
      token,
      admin: { id: admin.id, username: admin.username, storeId: store.id },
    };
  }

  loginTable(storeIdentifier, tableNumber, password, ip) {
    const store = adminRepository.findStoreByIdentifier(storeIdentifier);
    if (!store) {
      if (ip) recordFailedAttempt(ip);
      throw new AppError('매장을 찾을 수 없습니다', 401, 'UNAUTHORIZED');
    }

    const table = adminRepository.findTableByStoreAndNumber(store.id, tableNumber);
    if (!table) {
      if (ip) recordFailedAttempt(ip);
      throw new AppError('테이블 정보가 일치하지 않습니다', 401, 'UNAUTHORIZED');
    }

    const isValid = bcrypt.compareSync(password, table.password_hash);
    if (!isValid) {
      if (ip) recordFailedAttempt(ip);
      throw new AppError('테이블 정보가 일치하지 않습니다', 401, 'UNAUTHORIZED');
    }

    if (ip) clearFailedAttempts(ip);

    let session = adminRepository.findActiveSession(table.id);
    if (!session) {
      session = adminRepository.createSession(table.id);
    }

    const token = jwt.sign(
      { id: table.id, storeId: store.id, tableNumber: table.table_number, sessionId: session.id, role: 'table' },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      table: { id: table.id, tableNumber: table.table_number, storeId: store.id },
      sessionId: session.id,
    };
  }

  verifyToken(token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      return { valid: true, payload };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return { valid: false, error: 'TOKEN_EXPIRED' };
      }
      return { valid: false, error: 'INVALID_TOKEN' };
    }
  }
}

module.exports = new AuthService();
