# 🔒 Security Audit & Production Readiness

**Fecha:** Junio 2025  
**Proyecto:** WebPortafolio (Next.js + NestJS)  
**Estado:** ⚠️ Requiere correcciones antes de producción

---

## ❌ VULNERABILIDADES CRÍTICAS

### 1. **Credenciales Expuestas en Repositorio**
**Severidad:** 🔴 CRÍTICA  
**Ubicación:** `backend/.env.local`, `frontend/.env.local`, `sanity/.env.local`

**Problema:**
- SENDGRID_API_KEY visible en archivo `.env.local`
- DATABASE_URL con credenciales de Neon
- Keys de Sanity expuestos

**Solución:**
```bash
# Nunca commitear .env.local — debe estar en .gitignore
git rm --cached backend/.env.local
git rm --cached frontend/.env.local
git rm --cached sanity/.env.local

# Verificar .gitignore
echo ".env.local" >> .gitignore
```

**Para Producción:**
- Usar GitHub Secrets o variables de entorno del hosting
- En Netlify: Settings → Build & Deploy → Environment
- En AWS Lambda: Use AWS Secrets Manager o Parameter Store

---

### 2. **API URL Hardcoded en Frontend**
**Severidad:** 🔴 CRÍTICA  
**Ubicación:** `frontend/.env.local` y `frontend/components/ContactForm.tsx`

**Problema:**
```env
# ❌ MALO - Hardcoded
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Solución:**
```env
# ✅ BUENO - Por entorno
# .env.local (desarrollo)
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env.production (o variable en Netlify)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Acción:**
Editar `frontend/.env.local.example`:
```env
# Backend API — cambia según el entorno
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

### 3. **Sin Rate Limiting en Endpoint de Contacto**
**Severidad:** 🔴 CRÍTICA  
**Ubicación:** `backend/src/contact/contact.controller.ts`

**Riesgo:** 
- Spam masivo
- DoS attacks
- Costo de SendGrid sin control

**Solución:**
Instalar dependencia:
```bash
cd backend
npm install @nestjs/throttler
```

Actualizar `app.module.ts`:
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,        // 60 segundos
      limit: 5,       // 5 requests por ventana
    }),
    // ... otros imports
  ],
})
export class AppModule {}
```

Aplicar decorador en controller:
```typescript
import { Throttle } from '@nestjs/throttler';

@Controller('api/contact')
export class ContactController {
  @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 por minuto
  @Post()
  async createContact(@Body() dto: CreateContactDto) {
    // ...
  }
}
```

---

### 4. **Sin Helmet para Headers de Seguridad**
**Severidad:** 🔴 ALTA  
**Ubicación:** `backend/src/main.ts`

**Problema:**
Faltan headers HTTP de seguridad (X-Frame-Options, X-Content-Type-Options, etc.)

**Solución:**
```bash
npm install @nestjs/helmet
```

En `main.ts`:
```typescript
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Agregar Helmet
  app.use(helmet());
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com']
      : ['http://localhost:3000'],
    // ...
  });
  
  // ... resto del código
}
```

---

## ⚠️ VULNERABILIDADES ALTAS

### 5. **CORS Demasiado Permisivo en Desarrollo**
**Severidad:** 🟠 ALTA  
**Ubicación:** `backend/src/main.ts:8-13`

**Actual:**
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://jonatanzarate.dev'],
  credentials: true,
});
```

**Mejorar:**
```typescript
const allowedOrigins = 
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
    : ['http://localhost:3000'];

app.enableCors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
});
```

---

### 6. **Sin Validación de Email en ContactForm**
**Severidad:** 🟠 ALTA  
**Ubicación:** `frontend/components/ContactForm.tsx`

**Problema:**
El regex de email es muy permisivo:
```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// ✅ Valida: a@b.c (insuficiente)
```

**Solución - Actualizar ContactForm.tsx:**
```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// O usar una librería
import { isEmail } from 'class-validator';
```

---

### 7. **Sin Protección CSRF Explícita**
**Severidad:** 🟠 ALTA  
**Ubicación:** ContactForm POST

**Solución - Instalar:**
```bash
npm install csurf cookie-parser
```

En `main.ts`:
```typescript
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  app.use(csrf({ cookie: true }));
  
  // ...
}
```

---

### 8. **Errores Exponen Stack Traces**
**Severidad:** 🟠 ALTA  
**Ubicación:** `backend/src/contact/contact.service.ts:50-56`

**Actual:**
```typescript
catch (dbError) {
  this.logger.error('Failed to save contact message to DB', dbError);
  // Expone detalles del error
  throw new BadRequestException(
    'No se pudo guardar el mensaje. Inténtalo de nuevo.',
  );
}
```

✅ **Ya implementado correctamente** — No expone stack trace al cliente

---

## 📋 VULNERABILIDADES MEDIAS

### 9. **Health Endpoint Expuesto**
**Severidad:** 🟡 MEDIA  
**Ubicación:** `backend/src/main.ts:23-25`

**Actual:**
```typescript
app.use('/health', (_req: any, res: any) => {
  res.json({ status: 'OK' });
});
```

**Mejorar:**
```typescript
// Usar NestJS HttpCode decorator o mover a controlador
import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  health() {
    return { status: 'OK' };
  }
}
```

---

### 10. **Sin Logging de Seguridad**
**Severidad:** 🟡 MEDIA  
**Ubicación:** Backend completo

**Falta:**
- Logs de intentos fallidos de contacto
- Logs de errores de validación
- Logs de accesos a endpoints

**Solución:**
```typescript
// En contact.service.ts
async createContact(dto: CreateContactDto) {
  this.logger.log(`Contact form submitted by ${dto.email}`);
  
  try {
    const saved = await this.contactRepository.save(entity);
    this.logger.log(`Contact saved: ${saved.id}`);
    return { success: true, messageId: saved.id };
  } catch (error) {
    this.logger.error(`Failed to save contact from ${dto.email}`, error.message);
    throw new BadRequestException('Could not save message');
  }
}
```

---

## 🟢 BUENAS PRÁCTICAS (YA IMPLEMENTADAS)

✅ **Validación Strict**
- ValidationPipe con `whitelist: true, forbidNonWhitelisted: true`
- DTOs con class-validator

✅ **Secretos Protegidos en Producción**
- Usando variables de entorno
- Validación en `onModuleInit()`

✅ **Errores Genéricos al Cliente**
- No expone stack traces
- Mensajes de error seguros

✅ **TypeScript Strict**
- Tipos definidos correctamente

✅ **Sanity Configurado**
- Project ID público (es lo normal)
- Dataset production seguro

---

## 🚀 CHECKLIST DEPLOYMENT A PRODUCCIÓN

### Frontend (Netlify)

- [ ] Crear `netlify.toml` con configuración de production
- [ ] Configurar variables de entorno en Netlify UI
- [ ] Cambiar `NEXT_PUBLIC_API_URL` a URL real del backend
- [ ] Verificar que favicon se sirve correctamente
- [ ] Test: `npm run build` localmente

```toml
[build]
  command = "npm run build"
  publish = ".next"
  functions = "functions"

[env.production]
  NEXT_PUBLIC_API_URL = "https://api.yourdomain.com"
  NEXT_PUBLIC_SANITY_PROJECT_ID = "ohw2y3ub"
```

### Backend (AWS Lambda)

- [ ] Crear function en AWS Lambda
- [ ] Configurar variables de entorno:
  - DATABASE_URL (Neon Production Branch)
  - SENDGRID_API_KEY
  - CONTACT_EMAIL_TO
  - CONTACT_FROM_EMAIL
  - NODE_ENV=production
  
- [ ] Instalar dependencias de seguridad:
  ```bash
  npm install @nestjs/helmet @nestjs/throttler
  ```
  
- [ ] Actualizar `main.ts` con Helmet + Throttler

- [ ] Crear API Gateway con rate limiting

- [ ] Configurar CORS para dominio real

- [ ] Test: Hacer POST a `/api/contact` desde producción

### Sanity

- [ ] Verificar que dataset está en `production`
- [ ] Configurar CORS en Sanity (Settings → API)
- [ ] Whitelist: `https://yourdomain.com`

### General

- [ ] Review de `.env.example` vs `.env.local`
- [ ] Verificar `.gitignore` incluye `.env*`
- [ ] No hay credenciales en commits
- [ ] SSL/HTTPS habilitado en todos lados
- [ ] Test de formulario de contacto end-to-end

---

## 📝 COMANDOS PARA REMEDIAR AHORA

```bash
# 1. Asegurar que .env.local no está en git
git rm --cached backend/.env.local
git rm --cached frontend/.env.local
git rm --cached sanity/.env.local

# 2. Asegurar .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "chore: ensure .env.local is not tracked"

# 3. Instalar dependencias de seguridad
cd backend
npm install @nestjs/helmet @nestjs/throttler

# 4. Si hay credenciales expuestas en git history (crítico):
# Usar git-filter-repo para limpiar:
# pip install git-filter-repo
# git filter-repo --invert-paths --paths .env.local
```

---

## 🎯 PRIORIDAD DE CORRECCIONES

| Prioridad | Ítem | Tiempo |
|-----------|------|--------|
| 🔴 CRÍTICA | Quitar .env.local de git | 5 min |
| 🔴 CRÍTICA | Rate limiting en contacto | 15 min |
| 🔴 CRÍTICA | Helmet headers | 10 min |
| 🟠 ALTA | CSRF protection | 20 min |
| 🟡 MEDIA | Logging mejorado | 15 min |
| 🟡 MEDIA | Email validation | 5 min |

**Tiempo total estimado:** ~70 minutos

---

## ✅ ESTADO ACTUAL

**Frontend:** 70% Listo para Producción  
**Backend:** 60% Listo para Producción  
**General:** Necesita correcciones de seguridad antes de deplegar

**Una vez aplicadas las correcciones:** ✅ 95% Listo para Producción
