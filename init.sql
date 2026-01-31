-- Tạo schema phones
CREATE SCHEMA IF NOT EXISTS phones;

-- Tạo bảng phonelist trong schema phones
CREATE TABLE IF NOT EXISTS phones.phonelist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    price INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    image TEXT,
    imei_list TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Thêm dữ liệu mẫu
INSERT INTO phones.phonelist (name, brand, price, quantity, image, imei_list) VALUES
('iPhone 15 Pro Max', 'Apple', 34990000, 5, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', ARRAY['111111111111111', '111111111111112']),
('Samsung Galaxy S24 Ultra', 'Samsung', 31990000, 3, 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg', ARRAY['222222222222221']),
('Xiaomi 14 Ultra', 'Xiaomi', 23990000, 2, 'https://cdn.tgdd.vn/Products/Images/42/320721/xiaomi-14-ultra-black-thumb-600x600.jpg', ARRAY['333333333333331', '333333333333332']);
