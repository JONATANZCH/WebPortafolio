#!/bin/bash

echo "Checking Sanity data via API..."
echo ""

# Try to fetch from Sanity API with a direct query
curl -s "https://ohw2y3ub.api.sanity.io/v2021-06-07/data/query/production?query=%2A%5B_type%20%3D%3D%20%27about%27%5D" 2>&1 | grep -o "fullName\|David\|Jonatan" | head -5

echo ""
echo "Si ves 'David' → datos NUEVOS están en Sanity ✅"
echo "Si ves 'Jonatan' → datos VIEJOS siguen en Sanity ❌"
