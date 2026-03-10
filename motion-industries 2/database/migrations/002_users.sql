-- Migration 002: Users Table
-- Run: psql -U postgres -d motion_industries -f database/migrations/002_users.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Seed a test admin user (password: 'password123' — bcrypt hashed)
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@motionindustries.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
