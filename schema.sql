-- Mobile Xpress & Electronics — Database Schema
-- Run this once against your MySQL server:
--   mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS mobile_xpress
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mobile_xpress;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(80) NOT NULL,
  price INT NOT NULL,
  specs TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_brand (brand)
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  price VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

-- Seed data (same items your app shipped with)
INSERT INTO products (category, name, brand, price, specs, image) VALUES
('mobile', 'Galaxy S24 Ultra', 'Samsung', 124999, '12GB RAM, 256GB Storage, 200MP Camera', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80'),
('mobile', 'iPhone 15 Pro', 'Apple', 134999, 'A17 Pro chip, Titanium design, 48MP camera', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80'),
('laptop', 'MacBook Pro 16', 'Apple', 249999, 'M3 Pro chip, 18GB RAM, 512GB SSD', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80'),
('laptop', 'Dell XPS 15', 'Dell', 179999, 'Intel i7 13th Gen, 16GB RAM, OLED Touch Display', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80'),
('washing machine', 'Samsung Front Load 8kg', 'Samsung', 38999, 'AI Ecobubble, Wi-Fi connectivity, Hygiene Steam', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=500&q=80');

INSERT INTO services (category, name, description, price) VALUES
('mobile', 'Screen & Glass Replacement', 'Original display replacements with warranty for all mobile brands.', 'Starts at ₹1,499'),
('laptop', 'Battery & Keyboard Repair', 'Quick diagnostic, battery replacements, and key repairs for laptops.', 'Starts at ₹1,999'),
('washing machine', 'Motor & Drum Servicing', 'Comprehensive repair, PCB fixing, and deep cleaning for washing machines.', 'Starts at ₹699');