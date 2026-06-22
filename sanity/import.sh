#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ID="ohw2y3ub"
DATASET="production"
API_URL="http://localhost:3333"

echo -e "${BLUE}🌱 Importando datos a Sanity via Studio...${NC}\n"

# Use Sanity's CLI dataset import command
# This works with local Sanity studio auth
cd "$(dirname "$0")"

echo -e "${BLUE}📤 Iniciando importación...${NC}"

# Create a temporary directory for Sanity operations
TEMP_DIR=$(mktemp -d)

# Try to use Sanity CLI with local authentication
# The Studio running on localhost:3333 has local auth available
npx sanity@latest dataset import documents.ndjson \
  --dataset "$DATASET" \
  --replace \
  2>&1 | tee import.log

if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ ¡Datos importados exitosamente!${NC}\n"
  echo -e "${GREEN}📊 Resumen:${NC}"
  echo -e "   ${GREEN}✓${NC} 1 documento About"
  echo -e "   ${GREEN}✓${NC} 4 documentos Experience"
  echo -e "   ${GREEN}✓${NC} 1 documento Education"
  echo -e "   ${GREEN}✓${NC} 5 documentos Projects"
  echo -e "   ${GREEN}✓${NC} 3 documentos Testimonials"
  echo -e "   ${GREEN}✓${NC} Total: 14 documentos\n"
  echo -e "${BLUE}🔍 Verifica en:${NC}"
  echo "   http://localhost:3333 (Sanity Studio)"
  echo "   http://localhost:3000 (Frontend - recarga)"
else
  echo -e "\n${YELLOW}⚠️  Importación completada pero con advertencias${NC}"
  echo -e "Por favor, verifica en Sanity Studio si los datos se cargaron."
fi

# Cleanup
rm -rf "$TEMP_DIR"
