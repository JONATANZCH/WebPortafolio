# 🚀 Guía de Deployment a Producción

**Versión:** 1.0  
**Última actualización:** Junio 2025

---

## 📋 Checklist Pre-Deployment

- [ ] Todos los cambios committeados
- [ ] `npm audit` en backend ejecutado
- [ ] Tests locales pasando
- [ ] `.env.local` **NO está** en git
- [ ] Security audit completado (ver `SECURITY_AUDIT.md`)

---

## 1️⃣ Preparación Local

### Verificar que no hay secretos en git
```bash
git log --all -p | grep -i "api_key\|database_url\|secret" 
# No debería retornar nada
```

### Build test
```bash
# Frontend
cd frontend
npm run build

# Backend
cd ../backend
npm run build

cd ..
echo "✅ Ambos builds exitosos"
```

---

## 2️⃣ Configurar Netlify (Frontend)

### 1. Conectar repositorio
1. Ir a [netlify.com](https://netlify.com)
2. "New site from Git" → seleccionar repo
3. Build command: `npm run build`
4. Publish directory: `.next`

### 2. Configurar variables de entorno
En **Site settings → Environment**:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ohw2y3ub
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. Configurar dominio personalizado
En **Domain settings**:
- Agregar dominio personalizado
- Configurar DNS records (instrucciones de Netlify)

### 4. Habilitar SSL automático
- Netlify lo hace automáticamente (Let's Encrypt)

---

## 3️⃣ Configurar AWS Lambda (Backend)

### 1. Crear función Lambda

**Opción A: Desde AWS Console**
```
1. AWS Console → Lambda → Create function
2. Name: jonatanzarete-backend
3. Runtime: Node.js 20.x
4. Role: Create new role (basic Lambda execution)
5. Agregar permission: AmazonEC2FullAccess (para VPC si lo necesitas)
```

**Opción B: Usando AWS CLI**
```bash
aws lambda create-function \
  --function-name jonatanzarete-backend \
  --runtime nodejs20.x \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-role \
  --handler dist/src/main.handler \
  --zip-file fileb://backend.zip
```

### 2. Configurar variables de entorno en Lambda

En **Function configuration → Environment variables**:

```env
NODE_ENV=production
DATABASE_URL=postgresql://[user]:[password]@[neon-db].neon.tech/[db]?sslmode=require
SENDGRID_API_KEY=SG.XXXXXXXXXXXXX
CONTACT_EMAIL_TO=jonatanzch@gmail.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
PORT=3000
```

### 3. Configurar API Gateway

```
1. API Gateway → Create API → HTTP API
2. Configure routes:
   - GET /health
   - POST /api/contact
3. Attach Lambda function
4. Deploy a stage: prod
5. Anotar URL: https://xxxxxxxxxx.lambda-url.us-east-1.on.aws
```

### 4. Configurar CORS en API Gateway

En la integración Lambda:
```yaml
corsConfiguration:
  allowOrigins:
    - https://yourdomain.com
  allowMethods:
    - GET
    - POST
    - OPTIONS
  allowHeaders:
    - Content-Type
  maxAge: 300
```

---

## 4️⃣ Base de Datos (Neon)

### 1. Crear rama de producción

En Neon Console:
1. Branches → Create branch
2. Name: `main` (o `production`)
3. Base branch: `dev` (para copiar schema)

### 2. Obtener connection string de producción

En Neon → Branches → Production:
```
postgresql://neondb_owner:[password]@[host].neon.tech/[database]?sslmode=require
```

### 3. Ejecutar migraciones en producción

Desde tu máquina local:
```bash
# Temporalmente cambiar DATABASE_URL
export DATABASE_URL="postgresql://neondb_owner:[password]@[host].neon.tech/[database]?sslmode=require"

cd backend
npm run typeorm migration:run

unset DATABASE_URL
```

---

## 5️⃣ Sanity CMS

### 1. Crear token de lectura pública

En Sanity → API credentials:
```
1. Tokens → Add API token
2. Name: "Public Read"
3. Permissions: All datasets → Viewer
4. Copy token
```

### 2. Configurar CORS

En Sanity → Settings → API → CORS origins:
```
Agregar:
- https://yourdomain.com
- https://api.yourdomain.com
- https://[lambda-url].lambda-url.us-east-1.on.aws
```

### 3. Verificar datos en producción

```bash
curl "https://ohw2y3ub.api.sanity.io/v2021-06-07/data/query/production" \
  -H "Authorization: Bearer [token]" \
  --data-urlencode 'query=*[_type == "post"][0]'
```

---

## 6️⃣ SendGrid

### 1. Verificar dominio remitente

En SendGrid → Settings → Sender Authentication:
```
1. Si usas noreply@yourdomain.com:
   - Autenticar dominio (DNS records)
   
2. Si usas tu email (jonatanzch@gmail.com):
   - Sender verification ya completada
```

### 2. Crear API key de producción

```
1. Settings → API Keys → Create API Key
2. Full Access
3. Copy key → guardar en AWS Lambda env vars
```

---

## 7️⃣ Dominio personalizado

### Opción A: Usar dominio existente

1. **DNS records** (en tu registrador: GoDaddy, Namecheap, etc.):
```
A record:     yourdomain.com    → Netlify IP (proporciona Netlify)
CNAME record: api.yourdomain.com → [lambda-url].lambda-url.us-east-1.on.aws
CNAME record: www.yourdomain.com → yourdomain.com
```

2. **Agregar en Netlify**:
   - Domain settings → Custom domain
   - yourdomain.com

3. **Agregar en API Gateway**:
   - API Gateway → Custom domain names
   - Name: api.yourdomain.com
   - TLS: TLS 1.2
   - Attach a certificate (AWS Certificate Manager - gratis)

---

## ✅ Pruebas Post-Deployment

### 1. Frontend
```bash
# Verificar sitio carga
curl https://yourdomain.com

# Verificar favicon
curl -I https://yourdomain.com/favicon.svg

# Verificar assets se cargan
# Abrir en navegador y revisar Network tab
```

### 2. Backend
```bash
# Health check
curl https://api.yourdomain.com/health

# Obtener error (para verificar CORS)
curl -X POST https://api.yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{}' \
  -v
# Debería retornar 400 (validación) no CORS error
```

### 3. Formulario de contacto
```
1. Ir a https://yourdomain.com
2. Scroll a "Contacto"
3. Enviar formulario
4. Verificar:
   - Mensaje de éxito aparece
   - Email llega a jonatanzch@gmail.com
```

### 4. Blog
```
1. Ir a https://yourdomain.com/blog
2. Hacer clic en un artículo
3. Verificar cargue correctamente
4. Cambiar entre artículos
```

---

## 🔍 Monitoreo Post-Deployment

### Netlify Analytics
- Site settings → Analytics
- Revisar Core Web Vitals
- Target: Lighthouse > 85

### AWS Lambda CloudWatch
```bash
# Ver logs
aws logs tail /aws/lambda/jonatanzarete-backend --follow

# Métricas
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=jonatanzarete-backend \
  --start-time 2025-06-22T00:00:00Z \
  --end-time 2025-06-23T00:00:00Z \
  --period 3600 \
  --statistics Average
```

### SendGrid
- Dashboard → Email Activity
- Buscar correos de contacto
- Verificar delivery rate

---

## 🚨 Troubleshooting

### "CORS error" al hacer submit del formulario
```
Verificar:
1. FRONTEND_URL en Lambda env vars
2. API Gateway CORS config
3. Helmet en main.ts está habilitado
```

### "Email no llega"
```
Verificar:
1. SENDGRID_API_KEY es correcto
2. CONTACT_FROM_EMAIL está verificado en SendGrid
3. CONTACT_EMAIL_TO es correcto
4. CloudWatch logs en Lambda
```

### "Blog artículos no cargan"
```
Verificar:
1. NEXT_PUBLIC_API_URL es correcto
2. Sanity CORS incluye tu dominio
3. Sanity dataset es "production"
```

### "Favicon no aparece"
```
Verificar:
1. Archivo /public/favicon.svg existe en Netlify
2. Build incluye /public
3. Cache browser limpiado (Ctrl+Shift+R)
```

---

## 📞 Support & Documentation

- **Netlify Docs:** https://docs.netlify.com/
- **AWS Lambda:** https://docs.aws.amazon.com/lambda/
- **Sanity Docs:** https://www.sanity.io/docs/
- **Neon Docs:** https://neon.tech/docs/

---

## 🎯 Cronograma Sugerido

1. **Semana 1:** Preparación local + pruebas
2. **Semana 2:** Deploy de staging (verificar todo funciona)
3. **Semana 3:** Deploy a producción (durante horarios bajos de tráfico)
4. **Semana 4:** Monitoreo y optimización

---

## ✨ Notas Finales

- **Backups:** Neon automáticamente hace backups de tu DB
- **Scaling:** Lambda y API Gateway escalan automáticamente
- **Costos:** 
  - Netlify: Free hasta 100GB/mes
  - Lambda: Free tier hasta 1M requests/mes
  - Neon: Free hasta 3GB almacenamiento
  - Total: **Free para la mayoría de casos**

¡Listo para producción! 🚀
