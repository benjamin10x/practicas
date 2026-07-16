const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const ROLES_VALIDOS = ['admin', 'artesano', 'comprador'];

router.post('/registro', async (req, res, next) => {
  try {
    const { nombre, correo, contrasena, rol = 'comprador' } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Nombre, correo y contrasena son obligatorios' });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ mensaje: 'La contrasena debe tener al menos 6 caracteres' });
    }

    if (!ROLES_VALIDOS.includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol invalido' });
    }

    const correoNormalizado = correo.toLowerCase().trim();
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, rol`,
      [nombre.trim(), correoNormalizado, contrasenaHash, rol]
    );

    return res.status(201).json({ usuario: resultado.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ mensaje: 'El correo ya esta registrado' });
    }

    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Correo y contrasena son obligatorios' });
    }

    const correoNormalizado = correo.toLowerCase().trim();
    const resultado = await pool.query(
      'SELECT id, nombre, correo, contrasena_hash, rol FROM usuarios WHERE correo = $1',
      [correoNormalizado]
    );

    if (resultado.rowCount === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const usuario = resultado.rows[0];
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
