CREATE TABLE produkter (
    produkt_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    navn VARCHAR(255) NOT NULL,
    beskrivelse TEXT,
    pris DECIMAL(10, 2) NOT NULL,
    bilde_url VARCHAR(500),
    kategori VARCHAR(50),
    opprettet_dato TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO produkter (navn, beskrivelse, pris, bilde_url, kategori)
VALUES 
('Kaffetrakter', 'En super kaffetrakter som brygger raskt.', 899.00, 'bilder/kaffetrakter.jpg', 'musikere'),
('Ullgenser', 'Varm og god ullgenser til kalde dager.', 1299.50, 'bilder/ullgenser.jpg', 'bordkort');
