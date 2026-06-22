#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function runCommand(cmd) {
  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: path.dirname(new URL(import.meta.url).pathname),
    });
    if (stderr && !stderr.includes('Warning')) {
      console.error('Error:', stderr);
    }
    return stdout;
  } catch (error) {
    console.error('Command failed:', error.message);
    throw error;
  }
}

async function loadData() {
  console.log('🌱 Cargando datos en Sanity...\n');

  try {
    // Usar sanity dataset export/import con archivo NDJSON local
    const dataFile = path.join(path.dirname(new URL(import.meta.url).pathname), 'documents.ndjson');

    console.log('📤 Importando documentos desde documents.ndjson...');
    console.log('   Ubicación:', dataFile);
    console.log('   Dataset: production\n');

    // Intentar con sanity cli
    const cmd = `npx sanity@latest dataset import "${dataFile}" --dataset production --replace`;
    console.log('Ejecutando:', cmd, '\n');

    const result = await runCommand(cmd);
    console.log(result);

    console.log('\n✅ ¡Datos cargados!\n');
    console.log('📊 Resumen:');
    console.log('   ✓ 1 documento About');
    console.log('   ✓ 4 documentos Experience');
    console.log('   ✓ 1 documento Education');
    console.log('   ✓ 5 documentos Projects');
    console.log('   ✓ 3 documentos Testimonials');
    console.log('   ✓ Total: 14 documentos\n');
    console.log('🔍 Verifica en:');
    console.log('   http://localhost:3333 (Sanity Studio)');
    console.log('   http://localhost:3000 (Frontend - recarga)');
  } catch (error) {
    console.error('\n❌ Error al cargar datos:', error.message);
    console.log('\n💡 Alternativa: Copia el contenido de documents.ndjson y úsalo en:');
    console.log('   sanity dataset import documents.ndjson --dataset production');
    process.exit(1);
  }
}

loadData();
