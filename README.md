# Artisan Auction

Práctica full stack con backend Node.js, Express, PostgreSQL 15 y JWT, más app móvil React Native con Expo SDK 54 y TypeScript. La app sigue la arquitectura:

```text
Pantallas -> Hooks -> Repositorios -> API -> PostgreSQL
```

## Tecnologías

- PostgreSQL 15
- Node.js, Express, `pg`, `cors`, `dotenv`
- `bcryptjs` para hash de contraseñas
- JSON Web Tokens
- React Native con Expo SDK 54
- TypeScript
- React Navigation Native Stack

## Estructura

```text
backend-pm/
  database/init.sql
  src/index.js
  src/db.js
  src/middleware/auth.js
  src/rutas/auth.js
  src/rutas/artesanos.js
  src/rutas/productos.js

artisan-auction-app/
  App.tsx
  src/tipos/Artesano.ts
  src/repositorios/ArtesanoRepositorio.ts
  src/hooks/useArtesanos.ts
  src/hooks/useArtesano.ts
  src/pantallas/ArtesanosScreen.tsx
  src/pantallas/ArtesanoDetalleScreen.tsx
  src/navegacion/NavegacionPrincipal.tsx
```

## Requisitos

- Windows con PowerShell
- PostgreSQL 15 instalado
- Servicio `postgresql-x64-15`
- Node.js y npm
- Teléfono físico con Expo Go
- PC y teléfono en la misma red Wi-Fi

Si PowerShell bloquea `npm.ps1`, ejecuta los comandos como `npm.cmd` y `npx.cmd`.

## PostgreSQL 15

Verifica la versión:

```powershell
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" --version
```

Verifica el servicio:

```powershell
Get-Service postgresql-x64-15
```

Si está detenido, abre PowerShell como administrador y ejecuta:

```powershell
Start-Service postgresql-x64-15
```

## Variables de Entorno

Configura `backend-pm/.env` tomando como base `backend-pm/.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=COLOCA_AQUI_TU_CONTRASENA
DB_NAME=artisan_auction
JWT_SECRET=CAMBIA_ESTA_CLAVE_POR_UNA_SEGURA
```

El archivo `.env` no se sube a Git. El archivo `.env.example` sí se incluye.

## Crear la Base de Datos

Desde la raíz del repositorio:

```powershell
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" `
  -U postgres `
  -f ".\backend-pm\database\init.sql"
```

Cuando `psql` solicite contraseña, escribe la contraseña del usuario `postgres`.

Verifica los artesanos:

```powershell
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" `
  -U postgres `
  -d artisan_auction `
  -c "SELECT * FROM artesanos;"
```

## Iniciar el Backend

```powershell
cd backend-pm
npm start
```

El servidor escucha en:

```text
http://0.0.0.0:3000
```

## Pruebas de API

Los comandos completos están en:

```text
backend-pm/PRUEBAS.md
```

Prueba rápida:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:3000/health"
```

La respuesta debe incluir:

```json
{
  "estado": "ok",
  "bd": "conectada"
}
```

## Configurar IP Local en la App

Detecta la IP IPv4 de Wi-Fi:

```powershell
Get-NetIPAddress `
  -AddressFamily IPv4 |
Where-Object {
  $_.IPAddress -notlike "127.*" -and
  $_.IPAddress -notlike "169.254.*"
}
```

Usa la IP del adaptador `Wi-Fi`, no adaptadores virtuales, VPN, WSL, VirtualBox, Hyper-V ni Ethernet desconectado.

Edita:

```text
artisan-auction-app/src/repositorios/ArtesanoRepositorio.ts
```

y ajusta:

```typescript
const IP_COMPUTADORA = 'TU_IP_WIFI';
```

No uses `localhost`, `127.0.0.1` ni `10.0.2.2` para un teléfono físico.

## Firewall

Abre PowerShell como administrador:

```powershell
New-NetFirewallRule `
  -DisplayName "API Artisan Auction" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 3000 `
  -Action Allow
```

Antes de abrir Expo, prueba desde el navegador del teléfono:

```text
http://IP_DE_LA_COMPUTADORA:3000/health
```

Solo continúa si el teléfono muestra la respuesta de `/health`.

## Iniciar Expo

```powershell
cd artisan-auction-app
npx expo start
```

Escanea el QR con Expo Go en el teléfono físico.

Verifica SDK 54:

```powershell
Select-String '"expo":' package.json
npx expo install --fix
npx expo-doctor
```

`expo-doctor` debe terminar sin incompatibilidades importantes.

## Errores Comunes

### `password authentication failed`

La contraseña en `backend-pm/.env` no coincide con la contraseña real del usuario `postgres`. Corrige `DB_PASSWORD` y reinicia el backend.

### `ECONNREFUSED 5432`

PostgreSQL no está iniciado o el puerto no está disponible. Verifica:

```powershell
Get-Service postgresql-x64-15
```

### Error de red en Expo

Confirma que el backend esté corriendo, que `IP_COMPUTADORA` sea la IP Wi-Fi activa y que el teléfono pueda abrir `/health` en el navegador.

### Firewall bloqueando el puerto 3000

Ejecuta la regla de firewall indicada desde PowerShell como administrador.

### Teléfono y PC en redes diferentes

Conecta ambos a la misma red Wi-Fi. Algunas redes públicas o universitarias aíslan dispositivos entre sí.

### Uso incorrecto de `localhost`

En el teléfono, `localhost` apunta al teléfono, no a la PC. Usa la IP Wi-Fi de la computadora.

### Expo SDK diferente de 54

Corrige dependencias:

```powershell
cd artisan-auction-app
npm install expo@~54.0.36
npx expo install --fix
npx expo-doctor
```

### Token inexistente o inválido

`GET /productos` requiere:

```http
Authorization: Bearer TOKEN
```

Vuelve a ejecutar login y usa el token nuevo.

### Puerto 3000 ocupado

Busca el proceso:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
```

Cierra el proceso que ocupa el puerto o libera el puerto antes de iniciar el backend.
