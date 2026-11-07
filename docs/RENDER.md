# Desplegar el backend en Render (gratis)

El backend NestJS recibe el formulario de contacto, lo guarda en PostgreSQL (Neon) y avisa por correo.
Este documento explica cómo ponerlo en Render. Las cuentas y las claves las creas tú; el repositorio ya
trae todo lo demás (`render.yaml` en la raíz).

## 1. Crear las cuentas y claves (una sola vez)

1. **Render**: <https://render.com> → regístrate con tu cuenta de GitHub.
2. **Resend** (correo): <https://resend.com> → regístrate con **el correo donde quieres recibir los mensajes**
   (por ejemplo `jonatanzch@gmail.com`) → *API Keys* → *Create API Key* → copia la clave (`re_...`).
   - Sin dominio verificado, Resend solo entrega al correo de tu propia cuenta, que es justo lo que necesitas.
   - Si más adelante quieres un remitente propio (`no-reply@tudominio.com`), verifica el dominio en Resend y
     cambia `CONTACT_FROM_EMAIL`.
3. **Neon**: ya tienes la base de datos. Copia su *connection string* (`postgresql://...?sslmode=require`).

> Render **bloquea los puertos SMTP (25, 465 y 587) en el plan gratuito**, por eso el correo sale por la API de
> Resend y no por SMTP.

## 2. Crear el servicio con el Blueprint

1. En Render: **New +** → **Blueprint** → elige este repositorio.
2. Render lee `render.yaml` y te pide los valores secretos:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | La cadena de conexión de Neon |
| `RESEND_API_KEY` | La clave `re_...` de Resend |
| `CONTACT_EMAIL_TO` | El correo de tu cuenta de Resend |
| `FRONTEND_URL` | `https://jonatanzarate.dev,https://www.jonatanzarate.dev` (y tu URL de Netlify, separadas por coma) |

3. Pulsa **Apply**. El primer despliegue tarda unos minutos.
4. Cuando termine, abre `https://TU-SERVICIO.onrender.com/health`: debe responder `{"status":"OK"}`.

## 3. Conectar el sitio (Netlify)

En Netlify → *Site settings* → *Environment variables*:

```
NEXT_PUBLIC_API_URL = https://TU-SERVICIO.onrender.com
```

Vuelve a desplegar el sitio (la variable se incorpora al construirlo). El formulario enviará a
`https://TU-SERVICIO.onrender.com/api/contact`.

## 4. Probarlo

1. En el sitio, envía un mensaje de prueba desde el formulario.
2. Debe llegar a tu correo (revisa también spam la primera vez) y aparecer en la tabla `contact_messages`.
3. Si no llega el correo, mira los *Logs* del servicio en Render: el mensaje queda guardado aunque el correo falle.

## Cosas que conviene saber del plan gratuito

- **El servicio se duerme tras ~15 minutos sin tráfico** y la primera petición tarda unas decenas de segundos.
  El formulario "despierta" el backend en cuanto alguien lo toca, y puedes mantenerlo despierto con un monitor
  gratuito que llame a `/health` cada 5 minutos (por ejemplo UptimeRobot).
- Cambiar de proveedor de correo no requiere tocar código: cambia `EMAIL_PROVIDER` (`resend` o `sendgrid`) y la
  clave correspondiente.
- Para escalar más adelante basta con cambiar `plan: free` por un plan de pago en `render.yaml`.

## Probar la seguridad del formulario

```bash
cd backend
npm run security:check
```
