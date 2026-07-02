# Deploy de Linkedgol en Railway

## Arquitectura

Este proyecto está armado para desplegarse como **un solo servicio**: el
API server (Express) sirve tanto las rutas `/api/*` como los archivos
estáticos del frontend ya compilado. El frontend hace sus llamadas a la API
con rutas relativas (`/api/...`), así que **tienen que vivir en el mismo
origen** (mismo dominio) — no se puede separar en "frontend en Vercel +
backend en Railway" sin reescribir esas llamadas para usar una URL absoluta.

Si en el futuro querés separarlos, avisame y te preparo esa versión.

## 1. Creá el proyecto en Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** (subí primero este código a un repo de GitHub).
2. Railway va a detectar el `package.json` raíz. Como es un monorepo pnpm, necesitás configurar manualmente los comandos de build y arranque (ver paso 3).

## 2. Agregá la base de datos

1. Dentro del mismo proyecto de Railway: **New** → **Database** → **PostgreSQL**.
2. Railway crea automáticamente la variable `DATABASE_URL` — se la vas a pasar al servicio del API server en el paso siguiente (Railway permite referenciar variables entre servicios con `${{Postgres.DATABASE_URL}}`).

## 3. Configurá el servicio del API server

En **Settings** del servicio (no de la base de datos):

**Build Command:**
```
pnpm install && pnpm --filter @workspace/linkedgol build && pnpm --filter @workspace/db run push
```

**Start Command:**
```
pnpm --filter @workspace/api-server start
```

**Root Directory:** dejalo en la raíz del repo (el monorepo completo).

> Nota: `pnpm --filter @workspace/db run push` sincroniza el esquema de la
> base de datos (crea las tablas). Hace falta correrlo la primera vez y cada
> vez que cambiemos el esquema (por ejemplo, si agregamos un campo nuevo).
> Si preferís no correrlo en cada build, quitalo del Build Command y
> correlo manualmente desde la pestaña "Shell" de Railway cuando haga falta.

## 4. Variables de entorno

En la pestaña **Variables** del servicio del API server, cargá:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (referenciá la base que creaste) |
| `PORT` | `3000` (Railway te inyecta su propio `PORT` automáticamente en algunos planes — si es así, usá `${{PORT}}`) |
| `BASE_PATH` | `/` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | String random de 32+ caracteres. Generalo con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_PASSWORD` | La contraseña que vas a usar para entrar a `/admin` |
| `CORS_ORIGIN` | El dominio que Railway te asigne (ej. `https://linkedgol-production.up.railway.app`) — como todo corre en el mismo origen, esto es más una capa extra de seguridad |
| `APP_URL` | El mismo dominio de arriba — se usa para armar los links de los emails |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Opcional. Sin esto, los emails se imprimen en los logs del servidor en vez de enviarse de verdad — sirve para probar antes de conectar un proveedor real |
| `CONTACT_EMAIL` | Opcional — a dónde llegan los mensajes del formulario de contacto |

Ver `artifacts/api-server/.env.example` para la lista completa con comentarios.

## 5. Dominio

Railway te da un dominio gratis tipo `algo.up.railway.app` apenas deployás.
Si querés tu propio dominio (ej. `linkedgol.com`), lo conectás desde
**Settings → Networking → Custom Domain**.

## 6. Después del primer deploy

- Probá `/admin` con la contraseña que configuraste.
- Registrate como jugador/agente/club de prueba y confirmá que el email de
  verificación aparece en los logs (si no configuraste SMTP) o en tu bandeja
  (si sí lo configuraste).
- Si algo no levanta, revisá los **Logs** del servicio en Railway — los
  errores más comunes son `DATABASE_URL` mal copiada o `JWT_SECRET` faltante
  (el servidor no arranca sin él en producción, a propósito).
