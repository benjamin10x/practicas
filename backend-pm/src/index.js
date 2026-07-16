const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const authRouter = require('./rutas/auth');
const artesanosRouter = require('./rutas/artesanos');
const productosRouter = require('./rutas/productos');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');

    return res.status(200).json({
      estado: 'ok',
      bd: 'conectada',
      hora: resultado.rows[0].now
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      bd: 'sin conexion'
    });
  }
});

app.use('/auth', authRouter);
app.use('/artesanos', artesanosRouter);
app.use('/productos', productosRouter);

app.use((req, res) => {
  return res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error.message);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Artisan Auction escuchando en http://0.0.0.0:${PORT}`);
});
