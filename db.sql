CREATE DATABASE IF NOT EXISTS pc_clicker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pc_clicker;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bitcoin BIGINT DEFAULT 0,
    incremento INT DEFAULT 1,
    autoclicks INT DEFAULT 0,
    autoclickerIncrement INT DEFAULT 1,
    maxMonedas BIGINT DEFAULT 5000,
    gabinetepts INT DEFAULT 0,
    gabcompradoM TINYINT(1) DEFAULT 0,
    gabcompradoR TINYINT(1) DEFAULT 0,
    gabcompradoC TINYINT(1) DEFAULT 0,
    gabcompradoG TINYINT(1) DEFAULT 0,
    Clevel INT DEFAULT 0,
    Rlevel INT DEFAULT 0,
    Glevel INT DEFAULT 0,
    Dlevel INT DEFAULT 0,
    Molevel INT DEFAULT 0,
    Gablevel INT DEFAULT 0,
    Mlevel INT DEFAULT 0,
    Elevel INT DEFAULT 0,
    fondoActual VARCHAR(128) DEFAULT 'img/Fondo base.png',
    fondoEquipado VARCHAR(128) DEFAULT NULL,
    inventario TEXT,
    krystal INT DEFAULT 10000,
    equippedItemIndex INT DEFAULT NULL,
    fondos_comprados TEXT DEFAULT NULL,
    misiones_completadas TEXT DEFAULT NULL,
    misiones_niveles TEXT DEFAULT NULL,
    cajas_abiertas INT DEFAULT 0,
    max_bitcoins BIGINT DEFAULT 0,
    total_clicks BIGINT DEFAULT 0,
    total_bitcoins BIGINT DEFAULT 0,
    mejoras_compradas INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
