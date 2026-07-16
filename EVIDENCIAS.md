# Evidencias Requeridas

- [ ] Captura de `SELECT * FROM artesanos;` en psql o pgAdmin.
  Debe verse una terminal PowerShell ejecutando `psql.exe` de PostgreSQL 15 contra la base `artisan_auction`, con las filas de María Hernández, José Ramírez y Lucía Torres.

- [ ] Captura de `/health` respondiendo `bd: conectada`.
  Debe verse PowerShell ejecutando `Invoke-RestMethod -Method Get -Uri "http://localhost:3000/health"` y la respuesta con `estado` en `ok`, `bd` en `conectada` y una hora devuelta por PostgreSQL.

- [ ] Captura de `Invoke-RestMethod` con login exitoso y token.
  Debe verse PowerShell ejecutando el bloque de login, guardando `$respuesta`, y mostrando un JWT en `$respuesta.token` junto con el objeto `usuario`.

- [ ] Captura de `/productos` respondiendo `401` sin token.
  Debe verse PowerShell ejecutando el bloque con `Invoke-WebRequest` dentro de `try/catch` y mostrando el código `401`.

- [ ] Captura de `/productos` respondiendo `200` con token.
  Debe verse PowerShell ejecutando `Invoke-RestMethod` con el encabezado `Authorization = "Bearer $token"` y mostrando la lista de productos activos con el nombre del artesano.

- [ ] Captura de la app en el dispositivo físico mostrando artesanos.
  Debe verse Expo Go abierto en el teléfono físico con la pantalla `Artisan Auction` y la lista de artesanos cargada desde PostgreSQL.

- [ ] Captura o enlace del commit de GitHub con el backend.
  Debe verse GitHub en el repositorio remoto o la terminal con el commit `feat: Artisan Auction con Express PostgreSQL 15 y JWT`.
