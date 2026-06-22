#!/bin/bash

echo "Buscando y eliminando documento viejo..."

# Query para obtener el ID exacto
QUERY='*[_type == "about" && fullName == "Jonatan Zárate Chávez"]{_id}'
ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('*[_type == \"about\" && fullName == \"Jonatan Zárate Chávez\"]{_id}'))")

curl -s "https://ohw2y3ub.api.sanity.io/v2021-06-07/data/query/production?query=${ENCODED}" 2>&1
