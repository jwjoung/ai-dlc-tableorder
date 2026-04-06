const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('./errorHandler');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('인증이 필요합니다', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, config.jwtSecret);

    if (payload.role !== 'admin') {
      return next(new AppError('관리자 권한이 필요합니다', 403, 'FORBIDDEN'));
    }

    req.admin = {
      id: payload.id,
      storeId: payload.storeId,
      username: payload.username,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('세션이 만료되었습니다. 다시 로그인해주세요', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('유효하지 않은 인증 정보입니다', 401, 'INVALID_TOKEN'));
  }
}

module.exports = authMiddleware;
