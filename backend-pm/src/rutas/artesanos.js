const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, especialidad, ubicacion, descripcion FROM artesanos ORDER BY id'
    );

    return res.json(resultado.rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, especialidad, ubicacion, descripcion FROM artesanos WHERE id = $1',
      [req.params.id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Artesano no encontrado' });
    }

    return res.json(resultado.rows[0]);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
