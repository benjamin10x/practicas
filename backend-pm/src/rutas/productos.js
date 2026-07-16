const express = require('express');
const pool = require('../db');
const autenticarToken = require('../middleware/auth');

const router = express.Router();

router.use(autenticarToken);

router.get('/', async (req, res, next) => {
  try {
    const resultado = await pool.query(`
      SELECT
        p.id,
        p.artesano_id,
        p.nombre,
        p.descripcion,
        p.precio_inicial,
        p.activo,
        a.nombre AS artesano
      FROM productos p
      INNER JOIN artesanos a
        ON a.id = p.artesano_id
      WHERE p.activo = TRUE
      ORDER BY p.id;
    `);

    return res.json(resultado.rows);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!['admin', 'artesano'].includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para publicar productos' });
    }

    const { artesano_id, nombre, descripcion = null, precio_inicial } = req.body;
    const precio = Number(precio_inicial);

    if (!artesano_id || !nombre || precio_inicial === undefined || Number.isNaN(precio) || precio < 0) {
      return res.status(400).json({
        mensaje: 'artesano_id, nombre y precio_inicial mayor o igual a cero son obligatorios'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO productos (artesano_id, nombre, descripcion, precio_inicial)
       VALUES ($1, $2, $3, $4)
       RETURNING id, artesano_id, nombre, descripcion, precio_inicial, activo`,
      [artesano_id, nombre.trim(), descripcion, precio]
    );

    return res.status(201).json({ producto: resultado.rows[0] });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ mensaje: 'El artesano indicado no existe' });
    }

    return next(error);
  }
});

router.post('/:id/ofertas', async (req, res, next) => {
  try {
    const { monto } = req.body;
    const montoNumerico = Number(monto);

    if (monto === undefined || Number.isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({ mensaje: 'El monto debe ser numerico y mayor a cero' });
    }

    const producto = await pool.query(
      'SELECT id FROM productos WHERE id = $1 AND activo = TRUE',
      [req.params.id]
    );

    if (producto.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado o inactivo' });
    }

    const resultado = await pool.query(
      `INSERT INTO ofertas (producto_id, usuario_id, monto)
       VALUES ($1, $2, $3)
       RETURNING id, producto_id, usuario_id, monto, fecha`,
      [req.params.id, req.usuario.id, montoNumerico]
    );

    return res.status(201).json({ oferta: resultado.rows[0] });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
