/**
 * Añade la habilidad "decisiones de infraestructura" al rol actual (PastPost) y al perfil.
 * Uso: node scripts/add-infra-decisions.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

const ROLE = {
  '533061c8-06c5-4d5f-b4bc-f46717e5c5d3': {
    sentence: ' Evalúo y decido la infraestructura (serverless, contenedores o PaaS) según costo, escala y operación, y dejo cada decisión documentada en un ADR.',
    skills: ['Decisiones de infraestructura', 'FinOps', 'ADR'],
  },
  'bf9d9ff7-7d76-4b5f-aedc-d8d3d5107cc5': {
    sentence: ' I evaluate and decide infrastructure (serverless, containers or PaaS) based on cost, scale and operations, and document each decision in an ADR.',
    skills: ['Infrastructure decisions', 'FinOps', 'ADR'],
  },
};
const ABOUT_SKILLS = { es: ['Decisiones de infraestructura'], en: ['Infrastructure decision-making'] };

(async () => {
  for (const [id, cfg] of Object.entries(ROLE)) {
    const doc = await client.getDocument(id);
    if (!doc) { console.log('missing', id); continue; }
    const description = doc.description.includes(cfg.sentence.trim()) ? doc.description : doc.description.trimEnd() + cfg.sentence;
    const skills = [...new Set([...(doc.skills || []), ...cfg.skills])];
    await client.patch(id).set({ description, skills }).commit();
    console.log('role updated', id);
  }
  const about = await client.fetch('*[_type=="about"]{_id, language, skills}');
  for (const a of about) {
    const add = ABOUT_SKILLS[a.language === 'en' ? 'en' : 'es'];
    await client.patch(a._id).set({ skills: [...new Set([...(a.skills || []), ...add])] }).commit();
    console.log('about updated', a._id);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
