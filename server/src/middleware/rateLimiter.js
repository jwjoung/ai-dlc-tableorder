const { AppError } = require('./errorHandler');

const failedAttempts = new Map();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

function rateLimiter(req, res, next) {
  const key = req.ip;
  const now = Date.now();
  const record = failedAttempts.get(key);

  if (record) {
    if (now - record.firstAttempt < WINDOW_MS) {
      if (record.count >= MAX_ATTEMPTS) {
        const remainingMs = WINDOW_MS - (now - record.firstAttempt);
        const remainingMin = Math.ceil(remainingMs / 60000);
        return next(
          new AppError(
            `너무 많은 로그인 시도입니다. ${remainingMin}분 후 다시 시도해주세요`,
            429,
            'TOO_MANY_REQUESTS'
          )
        );
      }
    } else {
      failedAttempts.delete(key);
    }
  }

  next();
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (record && now - record.firstAttempt < WINDOW_MS) {
    record.count += 1;
  } else {
    failedAttempts.set(ip, { count: 1, firstAttempt: now });
  }
}

function clearFailedAttempts(ip) {
  failedAttempts.delete(ip);
}

module.exports = { rateLimiter, recordFailedAttempt, clearFailedAttempts };
