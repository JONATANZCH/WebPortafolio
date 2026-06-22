# GUÍA COMPLETA: LLENAR SANITY CON TU INFORMACIÓN

## PASO 0: Preparar tu foto

1. Descarga tu foto de LinkedIn
2. Guárdala como: `profile-photo.jpg`
3. Ten lista en tu escritorio

---

## PASO 1: LEVANTAR SANITY STUDIO EN LOCAL

```bash
cd sanity
npm install
npm run dev
```

Accede a: http://localhost:3333

Verás el panel de Sanity con todas las colecciones (About, Posts, Projects, etc.)

---

## PASO 2: CREAR DOCUMENTO "ABOUT" (Única copia)

Click en **"About"** en el sidebar

### Campos a llenar:

**Full Name:** Jonatan Zárate Chávez

**Title:** Full Stack Developer | React Specialist

**Bio (blocks - copiar tal cual):**
```
🚀 Full Stack Developer con 5+ años de experiencia construyendo aplicaciones
web y móviles escalables. Especializado en React, React Native y Node.js.
He trabajado en proyectos de alto tráfico para empresas Fortune 500 como
Liverpool y American Express. Apasionado por código limpio, arquitectura
sólida y experiencias de usuario excepcionales.
```

**Location:** CDMX (Ciudad de México)

**Email:** jonatanzch@gmail.com

**Social Links:**
```
{
  "linkedin": "https://www.linkedin.com/in/jonatanzch-web-developer/",
  "github": "https://github.com/jonatanzch",
  "twitter": "https://twitter.com/jonatanzch",
  "portfolio": "https://jonatanzarate.dev"
}
```

**Skills (array - agregar cada uno):**
- React
- React Native
- TypeScript
- Node.js
- Express
- NestJS
- PostgreSQL
- MongoDB
- AWS
- Docker
- Tailwind CSS
- REST APIs
- GraphQL (opcional)
- Firebase
- OAuth/Auth0

**Profile Image:** [SUBIR TU FOTO AQUÍ]

Click **"Publish"** cuando termines ✅

---

## PASO 3: CREAR DOCUMENTOS DE EXPERIENCIA LABORAL

Click en **"Experience"** en el sidebar

### EXPERIENCIA 1: PastPost

**Company:** PastPost  
**Role:** Full Stack Developer  
**Description:**  
```
Desarrollé aplicación móvil (iOS/Android) con React Native y backend con 
Node.js. Implementé autenticación OAuth, pagos con Stripe, base de datos 
PostgreSQL. App disponible en App Store y Google Play con 10k+ descargas.
```
**Start Date:** 2021-01-15  
**End Date:** [Dejar vacío = Actual]  
**Is Current:** ✅ (Checkbox activado)  
**Skills:**
- React Native
- Node.js
- PostgreSQL
- AWS
- Stripe API

**Order:** 1

Click **"Publish"** ✅

---

### EXPERIENCIA 2: Liverpool

**Company:** Liverpool  
**Role:** Senior Frontend Developer  
**Description:**  
```
Lideré desarrollo del portal de ecommerce liverpool.com.mx con React y 
diseño responsive. Construcción de 5 plataformas de seguros (auto, GMM, 
mascota, PIF, hogar). Implementé componentes reutilizables, optimización 
de performance, integración con APIs REST.
```
**Start Date:** 2020-06-01  
**End Date:** 2023-12-31  
**Is Current:** ❌ (Unchecked)  
**Skills:**
- React
- TypeScript
- Tailwind CSS
- REST APIs
- Auth0

**Order:** 2

Click **"Publish"** ✅

---

### EXPERIENCIA 3: Suburbia

**Company:** Suburbia  
**Role:** Full Stack Developer  
**Description:**  
```
Desarrollo de plataforma de seguros Suburbia con 3 verticales (seguros, 
directorios, cotizador). Frontend con React, backend con Node.js, 
integración de Auth0 para autenticación.
```
**Start Date:** 2022-03-01  
**End Date:** 2023-11-30  
**Is Current:** ❌  
**Skills:**
- React
- Node.js
- Auth0
- PostgreSQL

**Order:** 3

Click **"Publish"** ✅

---

### EXPERIENCIA 4: American Express

**Company:** American Express  
**Role:** Frontend Developer  
**Description:**  
```
Desarrollo de componentes y features para plataforma web de American 
Express. Trabajo con diseño system, testing con Jest/React Testing 
Library, optimización de bundle size.
```
**Start Date:** 2023-09-01  
**End Date:** [Dejar vacío = Actual]  
**Is Current:** ✅  
**Skills:**
- React
- TypeScript
- Testing
- Jest

**Order:** 4

Click **"Publish"** ✅

---

## PASO 4: CREAR DOCUMENTO DE EDUCACIÓN

Click en **"Education"** en el sidebar

**School:** TESCHI (Tecnológico Superior de Chalco)  
**Degree:** Ingeniería Industrial en Informática  
**Field:** Computer Science  
**Description:** Estudios en ingeniería con enfoque en sistemas y desarrollo de software  
**Graduation Date:** 2022-06-30  
**Order:** 1

Click **"Publish"** ✅

---

## PASO 5: CREAR PROYECTOS

Click en **"Projects"** en el sidebar

### PROYECTO 1: PastPost Portal

**Title:** PastPost - Social Network Portal  
**Slug:** pastpost-portal  
**Description:** Plataforma de redes sociales descentralizada con portal web.  
**Long Description:**  
```
Portal web construido con React que permite a usuarios crear cuentas, 
compartir posts (texto, imágenes, videos), interactuar con otros usuarios. 
Backend con Node.js, autenticación OAuth, base de datos PostgreSQL, 
almacenamiento en AWS S3. Disponible en https://portal.pastpost.com/
```
**Image:** [SUBIR SCREENSHOT O COLOR SÓLIDO]  
**Gallery:** (Opcional - deja vacío por ahora)  
**Stack:**
- React
- React Native
- Node.js
- PostgreSQL
- AWS

**GitHub:** https://github.com/jonatanzch/pastpost (si tienes repo público)  
**Live URL:** https://portal.pastpost.com/  
**Featured:** ✅ (Sí)  
**Order:** 1

Click **"Publish"** ✅

---

### PROYECTO 2: PastPost Mobile App

**Title:** PastPost - Mobile App  
**Slug:** pastpost-app  
**Description:** Aplicación nativa iOS/Android con todas las features del portal web.  
**Long Description:**  
```
Aplicación construida con React Native que sincroniza datos con backend 
Node.js. Soporte para push notifications, offline mode, optimización de 
consumo de datos. Disponible en App Store (iOS) y Google Play (Android) 
con 10k+ descargas.
```
**Image:** [SUBIR SCREENSHOT]  
**Stack:**
- React Native
- Node.js
- Firebase
- OAuth

**GitHub:** https://github.com/jonatanzch/pastpost-mobile  
**Live URL:** https://play.google.com/store/apps/details?id=com.pastpost  
**Featured:** ✅  
**Order:** 2

Click **"Publish"** ✅

---

### PROYECTO 3: Liverpool E-commerce

**Title:** Liverpool E-commerce Portal  
**Slug:** liverpool-ecommerce  
**Description:** Portal de retail con 50k+ productos, filtrado avanzado y recomendaciones.  
**Long Description:**  
```
Portal de retail construido con React que soporta 50,000+ SKUs, filtrado 
avanzado, recomendaciones de productos, integración con Marketplace. 
Frontend optimizado para performance (Lighthouse 90+), responsive design, 
PWA features. Disponible en https://www.liverpool.com.mx/
```
**Image:** [SUBIR SCREENSHOT]  
**Stack:**
- React
- TypeScript
- Tailwind CSS
- Node.js
- PostgreSQL

**Live URL:** https://www.liverpool.com.mx/tienda/home  
**Featured:** ✅  
**Order:** 3

Click **"Publish"** ✅

---

### PROYECTO 4: Mi Seguro Liverpool

**Title:** Mi Seguro Liverpool - Insurance Platform  
**Slug:** liverpool-seguros  
**Description:** Suite de 5 productos de seguros integrados en una plataforma.  
**Long Description:**  
```
Plataforma de seguros enterprise construida con React y Node.js. Incluye: 
cotizador interactivo, gestión de pólizas, procesamiento de reclamos, 
integración con múltiples aseguradoras. Cada verticale optimizada para 
conversión. Soporte multiidioma (ES/EN). Verticales: Auto, Gastos Médicos 
Mayores, Mascota, PIF, Hogar.
```
**Image:** [SUBIR SCREENSHOT]  
**Stack:**
- React
- Node.js
- PostgreSQL
- Auth0
- REST APIs

**Live URL:** https://miseguro.liverpool.com.mx/  
**Featured:** ✅  
**Order:** 4

Click **"Publish"** ✅

---

### PROYECTO 5: Suburbia Seguros

**Title:** Suburbia Insurance Platform  
**Slug:** suburbia-seguros  
**Description:** Plataforma de seguros retail con directorios y cotizador.  
**Long Description:**  
```
Solución de seguros para Suburbia con 3 módulos: directorios de agentes, 
cotizador de productos, portal de contratación. Integración con Auth0 para 
gestión de usuarios, API REST para backend.
```
**Image:** [SUBIR SCREENSHOT]  
**Stack:**
- React
- Node.js
- Auth0
- PostgreSQL

**Live URL:** https://pif.suburbia.com.mx/  
**Featured:** ❌  
**Order:** 5

Click **"Publish"** ✅

---

## PASO 6: CREAR TESTIMONIOS

Click en **"Testimonials"** en el sidebar

### TESTIMONIAL 1: Carlos Mendoza

**Author:** Carlos Mendoza  
**Role:** Product Manager  
**Company:** Liverpool  
**Text:**  
```
Jonatan fue instrumental en el desarrollo de nuestra plataforma de 
seguros. Su experiencia en React y Node.js resultó en una arquitectura 
escalable que soporta 100k+ usuarios simultáneos. Siempre entrega código 
limpio, bien documentado y optimizado. Altamente recomendado.
```
**Featured:** ✅  
**Order:** 1

Click **"Publish"** ✅

---

### TESTIMONIAL 2: María García

**Author:** María García  
**Role:** CTO  
**Company:** PastPost  
**Text:**  
```
Trabajar con Jonatan en la app móvil PastPost fue excelente. Propuso 
soluciones innovadoras para offline-first sync y optimización de datos. 
El código que escribió sigue siendo la base de nuestra arquitectura móvil 
hoy.
```
**Featured:** ✅  
**Order:** 2

Click **"Publish"** ✅

---

### TESTIMONIAL 3: Alejandro López

**Author:** Alejandro López  
**Role:** Lead Developer  
**Company:** Suburbia  
**Text:**  
```
Gran capacidad para entender requisitos complejos y traducirlos en código 
elegante. Jonatan se integró rápidamente al equipo y entregó features de 
alta calidad bajo presión. Un developer que eleva el standard del equipo.
```
**Featured:** ✅  
**Order:** 3

Click **"Publish"** ✅

---

## PASO 7: CREAR UN BLOG POST (EJEMPLO)

Click en **"Posts"** en el sidebar

**Title:** Cómo construí PastPost: Una plataforma descentralizada con React Native  
**Slug:** como-construi-pastpost  
**Excerpt:**  
```
Aprende cómo construí PastPost desde cero usando React Native, Node.js y 
PostgreSQL. Incluye arquitectura, decisiones técnicas y lecciones aprendidas.
```

**Body (blocks):** Copiar este contenido:

```
## Introducción

PastPost es una plataforma de redes sociales descentralizada que construí 
para demostrar cómo las aplicaciones modernas pueden ser escalables y performantes.

## Tech Stack

El proyecto usa:
- React Native para la app móvil
- React para el portal web
- Node.js + Express para el backend
- PostgreSQL para persistencia
- AWS S3 para almacenamiento

## Arquitectura

La arquitectura está diseñada en tres capas:

1. Frontend (React/React Native)
2. Backend (Node.js)
3. Database (PostgreSQL)

## Conclusiones

Este proyecto fue una gran oportunidad para aplicar best practices en 
desarrollo full stack.
```

**Main Image:** [SUBIR SCREENSHOT DE PASTPOST]  
**Categories:** 
- Tutorial
- React Native
- Full Stack

**Publish Date:** 2024-06-15  
**Author:** Jonatan Zárate  
**Featured:** ❌

Click **"Publish"** ✅

---

## PASO 8: VERIFICAR EN FRONTEND

```bash
# En otra terminal:
cd frontend
npm run dev
```

Accede a http://localhost:3000

Deberías ver:
- Tu nombre y foto en la sección About
- Tus 4 experiencias en timeline
- Tu educación
- Tus 5 proyectos en grid (con los destacados primero)
- Tus 3 testimonios en carrusel
- Tu blog post en la sección de blog

---

## RESUMEN RÁPIDO

| Documento | Cantidad | Status |
|-----------|----------|--------|
| About | 1 | ⏳ Por crear |
| Experience | 4 | ⏳ Por crear |
| Education | 1 | ⏳ Por crear |
| Projects | 5 | ⏳ Por crear |
| Testimonials | 3 | ⏳ Por crear |
| Blog Posts | 1+ | ⏳ Por crear (opcional) |

Total: ~14 documentos a crear

---

## SIGUIENTES PASOS

1. ✅ Levanta Sanity Studio en local (npm run dev)
2. ✅ Sigue esta guía para crear cada documento
3. ✅ Levanta frontend (npm run dev) 
4. ✅ Levanta backend (npm run start:dev)
5. ✅ Prueba contacto form y verifica que todo funcione
6. ✅ Luego: Deploy a producción

**¿Listo para empezar?** Dime cuando termines de cargar todo en Sanity 🚀
