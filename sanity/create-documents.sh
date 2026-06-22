#!/bin/bash

PROJECT_ID="ohw2y3ub"
DATASET="production"
API_URL="http://localhost:3333/api"

echo "🌱 Creando documentos en Sanity..."
echo ""

# Read NDJSON file and create each document
while IFS= read -r line; do
  if [ -z "$line" ]; then
    continue
  fi

  # Make API call to create document
  echo "$line" | curl -s -X POST \
    "$API_URL/documents" \
    -H "Content-Type: application/json" \
    -d @- > /dev/null 2>&1

  # Extract type and title for logging
  TYPE=$(echo "$line" | grep -o '"_type":"[^"]*' | head -1 | cut -d'"' -f4)
  TITLE=$(echo "$line" | grep -o '"title":"[^"]*' | head -1 | cut -d'"' -f4)
  COMPANY=$(echo "$line" | grep -o '"company":"[^"]*' | head -1 | cut -d'"' -f4)
  AUTHOR=$(echo "$line" | grep -o '"author":"[^"]*' | head -1 | cut -d'"' -f4)

  if [ -n "$TITLE" ]; then
    echo "✅ $TYPE: $TITLE"
  elif [ -n "$COMPANY" ]; then
    echo "✅ $TYPE: $COMPANY"
  elif [ -n "$AUTHOR" ]; then
    echo "✅ $TYPE: $AUTHOR"
  else
    echo "✅ $TYPE creado"
  fi

done < documents.ndjson

echo ""
echo "🎉 ¡TODOS LOS DOCUMENTOS CREADOS!"
echo ""
echo "📊 Verifica en:"
echo "   http://localhost:3333 (Sanity Studio)"
echo "   http://localhost:3000 (Frontend - recarga)"
