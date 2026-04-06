const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('./errorHandler');

function tableAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('테이블 인증이 필요합니다', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    if (payload.role !== 'table') {
      return next(new AppError('테이블 인증 정보가 아닙니다', 403, 'FORBIDDEN'));
    }

    req.table = {
      id: payload.id,
      storeId: payload.storeId,
      tableNumber: payload.tableNumber,
      sessionId: payload.sessionId,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('테이블 세션이 만료되었습니다', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('유효하지 않은 테이블 인증 정보입니다', 401, 'INVALID_TOKEN'));
  }
}

module.exports = tableAuthMiddleware;
