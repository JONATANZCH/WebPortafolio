#!/bin/bash

echo "🗑️  Eliminando TODOS los documentos viejos..."
echo ""

# Delete ALL old documents
for type in about experience education project testimonial post author category; do
  curl -s -X POST http://localhost:3333/api/documents \
    -H "Content-Type: application/json" \
    -d "{\"mutations\": [{\"delete\": {\"query\": \"_type == '$type'\"}}]}" > /dev/null 2>&1
  echo "✓ Eliminadas documentos type=$type"
done

echo ""
echo "✅ Limpieza completa"
