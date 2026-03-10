-- Motion Industries DB Init
-- Run: psql -U postgres -c "CREATE DATABASE motion_industries;"
-- Then: psql -U postgres -d motion_industries -f database/migrations/001_init.sql

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    part_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT true
);

-- Seed data (sample products similar to Motion Industries catalog)
INSERT INTO products (part_number, name, description, price, category, in_stock) VALUES
('MI-BRG-001', 'Deep Groove Ball Bearing 6205', 'Single row deep groove ball bearing, 25mm bore, 52mm OD, 15mm width. Suitable for high-speed applications.', 12.99, 'Bearings', true),
('MI-BRG-002', 'Tapered Roller Bearing 30205', 'Single row tapered roller bearing for combined radial and axial loads. 25mm bore, 52mm OD.', 24.50, 'Bearings', true),
('MI-BLT-001', 'V-Belt A38', 'Classical V-belt, A section, 38 inch pitch length. Oil and heat resistant rubber compound.', 8.75, 'Belts', true),
('MI-BLT-002', 'Timing Belt 450-5M-15', 'Synchronous timing belt, 5mm pitch, 15mm wide, 450mm length. Fiberglass tensile cords.', 19.99, 'Belts', false),
('MI-CHN-001', 'Roller Chain #40 10ft', 'ANSI #40 roller chain, 1/2 inch pitch, 10 foot length. Pre-lubricated for extended life.', 34.95, 'Chain', true),
('MI-MTR-001', '1/2 HP Electric Motor 1800 RPM', 'TEFC single phase electric motor, 1/2 HP, 1800 RPM, 115/230V, 56 frame.', 189.00, 'Motors', true),
('MI-CPL-001', 'Flexible Jaw Coupling 1in Bore', 'Spider jaw coupling, 1 inch bore, aluminum hubs with polyurethane spider insert.', 28.50, 'Couplings', true),
('MI-LUB-001', 'Multi-Purpose Grease 14oz', 'NLGI #2 lithium-complex grease. High temperature and water resistant. 14 oz cartridge.', 7.25, 'Lubricants', true);
