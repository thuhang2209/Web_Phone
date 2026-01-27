// index.js
require('dotenv').config(); // Đọc biến môi trường từ .env

const express = require('express');
const cors = require('cors'); // Tùy chọn: cho phép request từ frontend (nếu cần)
const path = require('path');

// Import middlewares
const { logger, errorHandler } = require('./middlewares');

// Import routes
const routes = require('./routes');

// Khởi tạo app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware toàn cục
app.use(logger);                // Ghi log request
app.use(cors());               // Cho phép cross-origin (nếu dùng React/Vue)
app.use(express.json());       // Phân tích body JSON
app.use(express.urlencoded({ extended: true })); // Nếu cần form-urlencoded

// Routes API
app.use('/api', routes);

// Error handler - PHẢI ở cuối cùng!
app.use(errorHandler);

// Chỉ chạy listen() khi không phải trên Vercel (development mode)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  // Graceful shutdown (đóng kết nối DB khi tắt server)
  process.on('SIGINT', async () => {
    console.log('\n Shutting down server...');
    try {
      const { closeDB } = require('./config/db');
      await closeDB();
    } catch (err) {
      console.error(' Lỗi khi đóng kết nối DB:', err.message);
    }
    process.exit(0);
  });

  // Khởi động server
  app.listen(PORT, () => {
    console.log(` Server đang chạy tại: http://localhost:${PORT}/api`);
  });
}

// Export app để Vercel sử dụng
module.exports = app;