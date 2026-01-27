// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('❌ [ERROR]', err.stack || err.message);

  // Trả về lỗi theo định dạng JSON
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;