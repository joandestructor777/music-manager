CREATE TABLE bandas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE canciones (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    duracion VARCHAR(10),
    album VARCHAR(100),
    banda_id INTEGER NOT NULL,
    
    CONSTRAINT fk_cancion_banda
        FOREIGN KEY (banda_id)
        REFERENCES bandas(id)
        ON DELETE CASCADE
);