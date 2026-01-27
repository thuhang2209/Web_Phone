// middlewares/logger.js
const logger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;

  console.log(`📥 [${new Date().toISOString()}] ${method} ${url} - IP: ${ip || 'unknown'}`);

  // Ghi log khi response kết thúc
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📤 ${res.statusCode} | ${duration}ms`);
  });

  next();
};

module.exports = logger;