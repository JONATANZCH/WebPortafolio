const fs = require('fs'), os = require('os'), path = require('path');
const { createClient } = require('@sanity/client');
const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

// Only practices already described in each case study (no new claims).
const P = {
  'pastpost-social-network': { es: ['Arquitectura hexagonal', 'Integración y entrega continuas', 'Decisiones documentadas (ADR)'], en: ['Hexagonal architecture', 'Continuous integration and delivery', 'Documented decisions (ADR)'] },
  'pastpost-mobile': { es: ['Spec-Driven Development'], en: ['Spec-Driven Development'] },
  'liverpool-ecommerce': { es: ['Spec-Driven Development'], en: ['Spec-Driven Development'] },
  'liverpool-seguros': { es: ['Strategy'], en: ['Strategy'] },
  'suburbia-seguros': { es: ['Adapter'], en: ['Adapter'] },
};
(async () => {
  const docs = await client.fetch(`*[_type=="project"]{_id, language, "slug": slug.current}`);
  for (const d of docs) {
    const p = P[d.slug];
    if (!p) continue;
    await client.patch(d._id).set({ 'caseStudy.practices': p[d.language === 'en' ? 'en' : 'es'] }).commit();
    console.log('updated', d.slug, d.language);
  }
})();
