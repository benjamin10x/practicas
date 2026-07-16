const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  const partes = authorization.split(' ');
  const formatoBearer = partes.length === 2 && partes[0] === 'Bearer';

  if (!formatoBearer) {
    return res.status(401).json({ mensaje: 'Formato de token invalido' });
  }

  const token = partes[1];

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token invalido o expirado' });
  }
}

module.exports = autenticarToken;
