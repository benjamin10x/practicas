# Pruebas del Backend

Ejecuta primero el backend:

```powershell
cd backend-pm
npm start
```

## Health

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:3000/health"
```

## Artesanos

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:3000/artesanos"
```

## Registro

```powershell
$registro = @{
  nombre = "Ana"
  correo = "ana@upq.mx"
  contrasena = "123456"
  rol = "artesano"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/auth/registro" `
  -Body $registro `
  -ContentType "application/json"
```

## Login y token

```powershell
$login = @{
  correo = "ana@upq.mx"
  contrasena = "123456"
} | ConvertTo-Json

$respuesta = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/auth/login" `
  -Body $login `
  -ContentType "application/json"

$token = $respuesta.token

$respuesta
$token
```

## Productos sin token

```powershell
try {
  Invoke-WebRequest `
    -Method Get `
    -Uri "http://localhost:3000/productos"
} catch {
  $_.Exception.Response.StatusCode.value__
  $_.ErrorDetails.Message
}
```

Resultado esperado:

```text
401
```

## Productos con token

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:3000/productos" `
  -Headers @{
    Authorization = "Bearer $token"
  }
```

El resultado esperado es código `200` y la lista de productos.
