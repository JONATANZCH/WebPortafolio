/**
 * Enlaza las herramientas de "Liderazgo técnico" con PastPost, Mi Seguro Liverpool y Suburbia
 * añadiéndolas al stack de esos tres casos (así el filtro por herramienta los encuentra).
 * Uso: node scripts/leadership-tools-cases.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

const TOOLS = {
  es: ['ADR', 'Roadmaps técnicos', 'Code review', 'Mentoría', 'Documentación'],
  en: ['ADR', 'Technical roadmaps', 'Code review', 'Mentoring', 'Documentation'],
};
const SLUGS = ['pastpost-social-network', 'liverpool-seguros', 'suburbia-seguros'];

(async () => {
  const docs = await client.fetch('*[_type=="project" && slug.current in $slugs]{_id, language, "slug": slug.current, stack}', { slugs: SLUGS });
  for (const d of docs) {
    const add = TOOLS[d.language === 'en' ? 'en' : 'es'];
    await client.patch(d._id).set({ stack: [...new Set([...(d.stack || []), ...add])] }).commit();
    console.log('updated', d.slug, d.language);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
