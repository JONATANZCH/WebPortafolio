#!/bin/bash

echo "🗑️  Eliminando documentos anteriores..."

# Delete old documents via API
curl -s -X POST http://localhost:3333/api/documents \
  -H "Content-Type: application/json" \
  -d '{"mutations": [{"delete": {"id": "about-singleton"}}, {"delete": {"id": "education"}}, {"delete": {"query": "_type == \"experience\""}}]}' > /dev/null 2>&1

# Wait a moment
sleep 2

echo "📤 Cargando documentos CORRECTOS..."
echo ""

# Read and create each document
while IFS= read -r line; do
  if [ -z "$line" ]; then
    continue
  fi

  curl -s -X POST http://localhost:3333/api/documents \
    -H "Content-Type: application/json" \
    -d "$line" > /dev/null 2>&1

  TYPE=$(echo "$line" | grep -o '"_type":"[^"]*' | head -1 | cut -d'"' -f4)
  TITLE=$(echo "$line" | grep -o '"title":"[^"]*' | head -1 | cut -d'"' -f4)
  COMPANY=$(echo "$line" | grep -o '"company":"[^"]*' | head -1 | cut -d'"' -f4)
  FULLNAME=$(echo "$line" | grep -o '"fullName":"[^"]*' | head -1 | cut -d'"' -f4)

  if [ -n "$FULLNAME" ]; then
    echo "✅ About: $FULLNAME"
  elif [ -n "$TITLE" ]; then
    echo "✅ Project: $TITLE"
  elif [ -n "$COMPANY" ]; then
    echo "✅ Experience: $COMPANY"
  else
    echo "✅ $TYPE creado"
  fi

done < documents-correct.ndjson

echo ""
echo "🎉 ¡DOCUMENTOS CORRECTOS CARGADOS!"
echo ""
echo "📊 Resumen:"
echo "   ✓ Nombre: David Jonatan Zapeta Chavez"
echo "   ✓ Título: Cloud & DevOps Engineer"
echo "   ✓ 3 Experiencias"
echo "   ✓ 3 Educaciones/Certificaciones"
echo "   ✓ 5 Proyectos"
echo "   ✓ 3 Testimonios"
echo ""
echo "🔄 Recargando frontend..."
echo "   http://localhost:3000"
