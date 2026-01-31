# Sử dụng image Node.js chính thức
# chuẩn bị môi trường nhẹ với Alpine Linux
FROM node:20-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json trước để tận dụng cache
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Mở port 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "index.js"]