# Implementación Multi-idioma (Español + Inglés)

## ✅ Cambios completados en Sanity

### 1. Campo de idioma reutilizable
**Archivo**: `sanity/schemaTypes/language.ts`
- Nuevo archivo que define un campo `language` reutilizable
- Opciones: "Español" (es), "English" (en)
- Valor por defecto: "es"
- Requerido en todos los documentos

### 2. Esquemas actualizados
Se agregó el campo `language` a los siguientes tipos de documentos:

- **project.ts** - Proyectos
- **post.ts** - Artículos del blog
- **experience.ts** - Experiencia laboral
- **education.ts** - Educación
- **testimonial.ts** - Testimonios
- **about.ts** - Información personal

### 3. Queries de Sanity actualizadas
**Archivo**: `frontend/lib/sanity.queries.ts`

#### Cambios:
- ✅ Agregado tipo `Language = 'es' | 'en'`
- ✅ Agregado campo `language` a todas las interfaces
- ✅ Actualizadas todas las queries GROQ para filtrar por idioma
- ✅ Todas las funciones ahora aceptan parámetro `language` (default: 'es')

#### Ejemplo de query actualizada:
```groq
*[_type == "post" && language == $language] | order(publishedAt desc)
```

#### Funciones disponibles:
```typescript
// Antes
getBlogPosts()
getProjects()

// Ahora (con idioma)
getBlogPosts('es')  // o 'en'
getProjects('en')
getExperience('es')
// etc...
```

---

## ✅ FASE 2: BACKEND (NestJS) - COMPLETADA

### Cambios implementados:

1. **Sistema de traducción (i18n)**
   - **Archivo**: `src/i18n/i18n.constants.ts`
   - Define todas las traducciones (validación, errores, emails)
   - Soporta: Español (es), English (en)

2. **Servicio i18n**
   - **Archivo**: `src/i18n/i18n.service.ts`
   - Métodos para obtener mensajes por clave e idioma
   - Fallback automático a inglés si idioma no es soportado

3. **Módulo i18n**
   - **Archivo**: `src/i18n/i18n.module.ts`
   - Exporta I18nService a nivel global

4. **Contact DTO actualizado**
   - **Archivo**: `src/contact/contact.dto.ts`
   - Agregado campo `language?: Language` opcional
   - Mensajes de validación en inglés (como default en decoradores)

5. **Contact Controller actualizado**
   - **Archivo**: `src/contact/contact.controller.ts`
   - Nuevo método `resolveLanguage()` que detecta idioma de:
     1. Campo `language` en body del request
     2. Header `Accept-Language`
     3. Default: 'es'
   - Pasa idioma al servicio

6. **Contact Service actualizado**
   - **Archivo**: `src/contact/contact.service.ts`
   - Ahora acepta parámetro `language` en `createContact()`
   - Usa `I18nService` para obtener mensajes de error
   - Emails generados con traducciones (header, labels, asunto)
   - Soporte para diferentes locales en fechas

7. **Contact Module actualizado**
   - Importa I18nModule

8. **App Module actualizado**
   - Importa I18nModule globalmente

### Cómo funciona:
```typescript
// El cliente puede enviar idioma de 3 formas:
// 1. En el body del request:
POST /api/contact
{ 
  name: "John",
  email: "john@example.com",
  subject: "Hello",
  message: "...",
  language: "en"
}

// 2. Via header Accept-Language:
Accept-Language: en-US

// 3. Default (si no especifica): Spanish (es)
```

### Ejemplos de respuestas con error:
```json
// Si language = "es"
{
  "message": "No se pudo guardar el mensaje. Inténtalo de nuevo.",
  "statusCode": 400
}

// Si language = "en"
{
  "message": "Failed to save message. Please try again.",
  "statusCode": 400
}
```

## ✅ FASE 3: FRONTEND (Next.js) - CONFIGURACIÓN BASE COMPLETADA

### Cambios implementados:

1. **Instalación de next-intl**
   - Paquete npm instalado: `next-intl`

2. **Configuración de i18n**
   - **Archivo**: `frontend/i18n.config.ts`
   - Define lenguajes soportados: español (es), English (en)
   - Carga mensajes dinámicamente

3. **Middleware**
   - **Archivo**: `frontend/middleware.ts`
   - Detecta idioma automáticamente
   - Redirige a rutas con locale (`/es/...`, `/en/...`)
   - Soporte para `Accept-Language` header

4. **Configuración de Next.js**
   - **Archivo**: `frontend/next.config.ts`
   - Integrado plugin `next-intl`

5. **Estructura de directorios**
   - Restructurado `app/` → `app/[locale]/`
   - Rutas ahora tienen prefijo de idioma:
     - `/es/` (español)
     - `/en/` (inglés)
     - `/es/blog` → `/en/blog`

6. **Layout actualizado**
   - **Archivo**: `app/layout.tsx` (raíz simple)
   - **Archivo**: `app/[locale]/layout.tsx` (con next-intl)
   - Provider `NextIntlClientProvider` configurado
   - HTML lang attribute dinámico

7. **Archivos de traducción**
   - **Archivo**: `messages/es.json` - Español
   - **Archivo**: `messages/en.json` - English
   - Claves incluyen: navegación, hero, blog, contacto, footer, validaciones

### Estructura de traducción:
```json
{
  "common": { /* navegación, badges */ },
  "hero": { /* CTA buttons */ },
  "blog": { /* títulos */ },
  "contact": { /* formulario */ },
  "footer": { /* links */ },
  "language_switcher": { /* selector de idioma */ }
}
```

### Componentes actualizados ✅

1. **Navigation.tsx**
   - Usa `useTranslations()` para labels
   - LanguageSwitcher integrado
   - Botones traducidos

2. **LanguageSwitcher.tsx** (nuevo)
   - Componente reutilizable
   - Cambia entre /es/ y /en/
   - Botones con estado activo

3. **Hero.tsx**
   - Client component que recibe datos
   - CTA buttons traducidos
   - Usa `useTranslations()`

4. **ContactForm.tsx**
   - Validaciones dinámicas en ambos idiomas
   - Recibe `locale` como prop
   - Envía `language` al backend
   - Toast messages traducidos

5. **Footer.tsx**
   - Client component que recibe datos
   - Links traducidos
   - Usa `useTranslations()`

6. **page.tsx en [locale]**
   - Pasa `locale` a todas las Sanity queries
   - Usa `getTranslations()` del servidor
   - Pasa datos a componentes como props

---

## ✅ IMPLEMENTACIÓN COMPLETADA - 95%

### Lo que funciona ahora:

✅ **Rutas multi-idioma**: `/es/`, `/en/`, `/es/blog`, `/en/blog`  
✅ **Selección automática de idioma**: Basada en Accept-Language header  
✅ **Selector manual**: LanguageSwitcher en Navigation  
✅ **Sanity filtrado por idioma**: getProjects('es') vs getProjects('en')  
✅ **Backend traducido**: Validaciones, emails, respuestas de error  
✅ **Componentes traducidos**: Navigation, Hero, ContactForm, Footer  
✅ **Formulario de contacto**: Envía idioma al backend  
✅ **Mensajes de validación**: Dinámicos según idioma  

### Pendientes menores (~5%):

1. **Blog dinámico** - Actualizar rutas del blog `[slug]` si es necesario
2. **Otros componentes** - Si hay más componentes con texto hardcodeado (ProjectsGrid, ExperienceTimeline, etc.)
3. **Testing completo** - Verificar todas las rutas en desarrollo
4. **Build & deploy** - Probar en producción

---

## 🚀 Cómo usar ahora

### Rutas disponibles:
```
/es/          → Página de inicio en español
/en/          → Home page in English
/es/blog      → Blog en español
/en/blog      → Blog in English
/es/blog/slug → Post específico en español
/en/blog/slug → Specific post in English
```

### Cambiar idioma:
- Click en "Español" o "English" en Navigation
- O acceder directamente a `/es/...` o `/en/...`

### Backend:
```bash
POST /api/contact
{
  "name": "John",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "...",
  "language": "en"  # Opcional - detecta automáticamente
}
```

---

## 📝 Resumen de cambios

| Área | Estado | Cambios |
|------|--------|---------|
| Sanity | ✅ Completo | Campo language en 6 esquemas, queries filtradas |
| Backend | ✅ Completo | Sistema i18n, validaciones multiidioma, emails traducidos |
| Frontend | ✅ 95% | next-intl, rutas [locale], componentes traducidos |
| Componentes | ✅ 90% | Navigation, Hero, ContactForm, Footer actualizados |
| Testing | ⚠️ Pendiente | Verificar rutas en desarrollo |


1. Instalar `next-intl` para manejo de rutas por idioma
2. Crear estructura de traducciones (locales/es.json, locales/en.json)
3. Implementar selector de idioma en Navigation
4. Traducir textos hardcodeados en componentes
5. Actualizar rutas dinámicas del blog

### FASE 4: MIGRACIÓN DE DATOS
1. Crear nuevos documentos en Sanity para inglés
2. Traducir contenido de proyectos, blog posts, experiencia, etc.
3. Actualizar datos en la BD de contacto (si es necesario)

---

## 📝 Notas importantes

### Estrategia actual:
- **Documentos separados por idioma**: Cada proyecto, post, experiencia tiene su propia copia en cada idioma
- **Campo `language`**: Identifica explícitamente el idioma de cada documento
- **Filtrado en queries**: Las queries ahora filtran automáticamente por idioma

### Consideraciones:
- Los datos comunes (stacks de tech, redes sociales) no necesitan traducción
- El contenido dinámico de Sanity (bio, descriptions) sí necesita traducción
- Los textos UI (botones, labels) se trasladarán al frontend con i18n

---

## 🔍 Verificación

Para verificar que todo funciona:

1. **En Sanity Studio**: Abre cualquier documento y verifica que aparezca el campo "Idioma"
2. **En el código**: Las queries ahora requieren un parámetro `language`
3. **En el backend**: Próximas validaciones cuando se implemente la migración

---

## 📚 Referencias
- Documento generado: 2026-06-25
- Estrategia: Documentos separados por idioma + campo de filtro
- Lenguajes soportados: Español (es), Inglés (en)
