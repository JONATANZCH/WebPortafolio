const fs = require('fs'), os = require('os'), path = require('path');
const { createClient } = require('@sanity/client');
const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });
const ADD = { es: ['Spec-Driven Development', 'TDD', 'Patrones de diseño', 'CQRS', 'Saga', 'Outbox', 'Circuit Breaker', 'ADR'], en: ['Spec-Driven Development', 'TDD', 'Design patterns', 'CQRS', 'Saga', 'Outbox', 'Circuit Breaker', 'ADR'] };
const SENT = {
  es: ['Tengo base técnica en Java', 'Trabajo con Spec-Driven Development, TDD y patrones de diseño para que el sistema siga siendo entendible. Tengo base técnica en Java'],
  en: ['I have a technical foundation in Java', 'I work with Spec-Driven Development, TDD and design patterns to keep systems understandable. I have a technical foundation in Java'],
};
(async () => {
  const docs = await client.fetch(`*[_type=="about"]{_id, language, skills, bio}`);
  for (const d of docs) {
    const lang = d.language === 'en' ? 'en' : 'es';
    const skills = [...new Set([...(d.skills || []), ...ADD[lang]])];
    const bio = JSON.parse(JSON.stringify(d.bio || []));
    const span = bio[0] && bio[0].children && bio[0].children[0];
    if (span && span.text.includes(SENT[lang][0]) && !span.text.includes('Spec-Driven')) span.text = span.text.replace(SENT[lang][0], SENT[lang][1]);
    await client.patch(d._id).set({ skills, bio }).commit();
    console.log('updated', d._id);
  }
})();
