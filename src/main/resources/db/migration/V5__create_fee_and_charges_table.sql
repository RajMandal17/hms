-- Create table for fees and charges
CREATE TABLE fee_and_charges (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(64) NOT NULL,
    description VARCHAR(255),
    amount DOUBLE NOT NULL
);
-- Insert default values
INSERT INTO fee_and_charges (type, description, amount) VALUES
('ROOM', 'Room Charges (per day)', 1000.0),
('PRESCRIPTION', 'IPD Prescription Fee', 200.0),
('CONSULTATION', 'Consultation Fee', 500.0);
