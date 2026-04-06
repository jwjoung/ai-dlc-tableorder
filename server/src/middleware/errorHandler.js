class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const response = {
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
    },
  };

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  console.error(`[ERROR] ${statusCode} ${err.code || 'INTERNAL_ERROR'}: ${err.message}`);

  res.status(statusCode).json(response);
}

module.exports = { AppError, errorHandler };
