# ⚡ CARGAR TODO EN SANITY EN 2 MINUTOS

## Paso 1: Abre Sanity Studio

```
http://localhost:3333
```

## Paso 2: Importa el archivo de datos

En Sanity Studio, ve a:

```
🔧 Settings (esquina inferior izquierda)
  ↓
Datasets
  ↓
Click en tu dataset "production"
  ↓
Look for "Import data" / "Importar datos"
  ↓
Busca y selecciona el archivo: 
   C:\Users\didie\Documents\personalProject\WebPortafolio\sanity\documents.ndjson
  ↓
Click "Import"
  ↓
Wait 30 seconds...
  ↓
🎉 ¡LISTO! Todos tus datos estarán en Sanity
```

## ¿No ves la opción de Import?

Si no ves "Import" en Settings, haz esto:

1. Abre Terminal/PowerShell
2. Corre esto:

```bash
cd C:\Users\didie\Documents\personalProject\WebPortafolio\sanity
sanity login
# (Sigue el flow de login)
sanity dataset import documents.ndjson --dataset production --replace
```

Eso es TODO.

## Después de importar:

1. Recarga http://localhost:3000
2. Deberías ver TODO:
   - Tu nombre y bio
   - 4 trabajos
   - Tu educación
   - 5 proyectos
   - 3 testimonios

✅ DONE!
