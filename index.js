// index.js
require("dotenv").config(); // Đọc biến môi trường từ .env

const express = require("express");
const cors = require("cors"); // Tùy chọn: cho phép request từ frontend (nếu cần)
const path = require("path");

// Import middlewares
const { logger, errorHandler } = require("./middlewares");

// Import routes
const routes = require("./routes");

// Khởi tạo app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware toàn cục
app.use(logger); // Ghi log request
app.use(cors()); // Cho phép cross-origin (nếu dùng React/Vue)
app.use(express.json()); // Phân tích body JSON
app.use(express.urlencoded({ extended: true })); // Nếu cần form-urlencoded

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Routes API
app.use("/api", routes);

// Route mặc định trả về index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Error handler - PHẢI ở cuối cùng!
app.use(errorHandler);

// Graceful shutdown (đóng kết nối DB khi tắt server)
process.on("SIGINT", async () => {
  console.log("\n⏹ Shutting down server...");
  try {
    const { closeDB } = require("./config/db");
    await closeDB();
  } catch (err) {
    console.error("❌ Lỗi khi đóng kết nối DB:", err.message);
  }
  process.exit(0);
});

// Chỉ chạy listen() khi không phải trên Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  });
}

// Export app để Vercel sử dụng
module.exports = app;
