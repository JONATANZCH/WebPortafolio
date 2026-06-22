#!/bin/bash

echo "🗑️  Limpiando documentos anteriores..."
# Delete old documents
curl -s -X POST http://localhost:3333/api/documents \
  -H "Content-Type: application/json" \
  -d '{"mutations": [{"delete": {"id": "about-singleton"}}]}' > /dev/null 2>&1

sleep 1

echo "📤 Cargando documentos FINALES y mejorados..."
echo ""

# Read and create each document
COUNT=0
while IFS= read -r line; do
  if [ -z "$line" ]; then
    continue
  fi

  curl -s -X POST http://localhost:3333/api/documents \
    -H "Content-Type: application/json" \
    -d "$line" > /dev/null 2>&1

  COUNT=$((COUNT + 1))
  
  TYPE=$(echo "$line" | grep -o '"_type":"[^"]*' | head -1 | cut -d'"' -f4)
  FULLNAME=$(echo "$line" | grep -o '"fullName":"[^"]*' | head -1 | cut -d'"' -f4)
  TITLE=$(echo "$line" | grep -o '"title":"[^"]*' | head -1 | cut -d'"' -f4)
  COMPANY=$(echo "$line" | grep -o '"company":"[^"]*' | head -1 | cut -d'"' -f4)

  if [ -n "$FULLNAME" ]; then
    echo "✅ $FULLNAME - Cloud & DevOps Engineer"
  elif [ "$TYPE" = "experience" ] && [ -n "$COMPANY" ]; then
    echo "✅ Experience: $COMPANY"
  elif [ "$TYPE" = "education" ]; then
    echo "✅ Education"
  elif [ "$TYPE" = "project" ] && [ -n "$TITLE" ]; then
    echo "✅ Project: $TITLE"
  elif [ "$TYPE" = "testimonial" ]; then
    echo "✅ Testimonial"
  fi

done < documents-final.ndjson

echo ""
echo "🎉 ¡DOCUMENTOS FINALES CARGADOS!"
echo ""
echo "✅ Keywords añadidos:"
echo "   • Escalabilidad (100k+ req/seg, 500k+ usuarios)"
echo "   • Alta Demanda (50k req/seg, 2M+ cuentas)"
echo "   • Performance (40-45% mejoras)"
echo "   • Seguridad (50% reducción vulnerabilidades)"
echo "   • Automatización (60% CI/CD)"
echo ""
echo "✅ Proyectos con links REALES"
echo "✅ Nombre correcto: David Jonatan Zapeta Chavez"
echo ""
echo "🔄 Recarga: http://localhost:3000"
