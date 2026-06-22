#!/bin/bash

echo "🗑️  Eliminando documento VIEJO de About..."
echo ""

# Get the ID of the old about document
OLD_ID=$(curl -s "https://ohw2y3ub.api.sanity.io/v2021-06-07/data/query/production?query=%2A%5B_type%20%3D%3D%20%27about%27%20%26%26%20fullName%20%3D%3D%20%27Jonatan%20Z%C3%A1rate%20Ch%C3%A1vez%27%5D%7B_id%7D" 2>&1 | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

echo "ID encontrado: $OLD_ID"

if [ -n "$OLD_ID" ]; then
  curl -s -X POST http://localhost:3333/api/documents \
    -H "Content-Type: application/json" \
    -d "{\"mutations\": [{\"delete\": {\"id\": \"$OLD_ID\"}}]}" > /dev/null 2>&1
  echo "✅ Documento viejo ELIMINADO"
else
  echo "❌ No se encontró documento viejo"
fi

echo ""
echo "Verificando que solo quede el documento NUEVO..."
curl -s "https://ohw2y3ub.api.sanity.io/v2021-06-07/data/query/production?query=%2A%5B_type%20%3D%3D%20%27about%27%5D%7BfullName%7D" 2>&1 | grep "David"
