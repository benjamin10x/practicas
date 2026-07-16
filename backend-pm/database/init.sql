DROP DATABASE IF EXISTS artisan_auction;
CREATE DATABASE artisan_auction;

\connect artisan_auction

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) UNIQUE NOT NULL,
  contrasena_hash TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'comprador'
    CHECK (rol IN ('admin', 'artesano', 'comprador')),
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE artesanos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  ubicacion VARCHAR(100),
  descripcion TEXT
);

CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  artesano_id INTEGER NOT NULL
    REFERENCES artesanos(id)
    ON DELETE CASCADE,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  precio_inicial NUMERIC(10,2) NOT NULL
    CHECK (precio_inicial >= 0),
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE ofertas (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER NOT NULL
    REFERENCES productos(id)
    ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL
    REFERENCES usuarios(id),
  monto NUMERIC(10,2) NOT NULL
    CHECK (monto > 0),
  fecha TIMESTAMP DEFAULT NOW()
);

INSERT INTO artesanos
(nombre, especialidad, ubicacion, descripcion)
VALUES
(
  'María Hernández',
  'Alfarería',
  'Amealco, Querétaro',
  'Muñecas Lele y barro tradicional'
),
(
  'José Ramírez',
  'Textiles',
  'Tolimán, Querétaro',
  'Rebozos y bordados otomíes'
),
(
  'Lucía Torres',
  'Vara de sauce',
  'Tequisquiapan, Querétaro',
  'Cestería artesanal'
);

INSERT INTO productos
(artesano_id, nombre, descripcion, precio_inicial)
VALUES
(
  1,
  'Muñeca Lele grande',
  'Muñeca artesanal de 40 cm',
  350.00
),
(
  2,
  'Rebozo de seda',
  'Rebozo tejido a mano',
  1200.00
),
(
  3,
  'Canasta de sauce',
  'Canasta mediana tejida',
  180.00
);
