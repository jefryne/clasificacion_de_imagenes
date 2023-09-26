DROP DATABASE senasoft;
CREATE DATABASE senasoft;
USE senasoft;

CREATE TABLE usuarios(
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(100)
);

CREATE TABLE clasificados(
    id_clasificado INT PRIMARY KEY,
    categoria VARCHAR(50),
    num_analisis INT
);

INSERT INTO `clasificados` (`id_clasificado`, `categoria`, `num_analisis`) VALUES 
('1', 'Personas', '0'),
('2', 'Gatos', '0'),
('3', 'Patos', '0'),
('4', 'AMERICAN KESTREL', '0'),
('5', 'AMERICAN GOLDFINCH', '0'),
('6', 'AMERICAN REDSTART', '0'),
('7', 'AFRICAN FIREFINCH', '0'),
('8', 'ALEXANDRINE PARAKEET', '0'),
('9', 'AMERICAN BITTERN', '0');

