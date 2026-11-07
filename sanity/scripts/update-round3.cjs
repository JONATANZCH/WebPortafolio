/**
 * Ronda 3: 5+ años, Data Engineer y skills de seguridad.
 * Uso: node scripts/update-round3.cjs [--apply]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

function getToken() {
  if (process.env.SANITY_TOKEN) return process.env.SANITY_TOKEN;
  for (const f of [path.join(os.homedir(), '.config', 'sanity', 'config.json'), path.join(process.env.APPDATA || '', 'sanity', 'config.json')]) {
    try { return JSON.parse(fs.readFileSync(f, 'utf8')).authToken; } catch (_) {}
  }
  throw new Error('Sin token de Sanity');
}
const APPLY = process.argv.includes('--apply');
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token: getToken() });

const block = (text) => [{ _key: 'bio-1', _type: 'block', style: 'normal', markDefs: [], children: [{ _key: 'bio-1-s', _type: 'span', marks: [], text }] }];

const BIO_ES = '☁️ Ingeniero Backend, Cloud e IA generativa con más de 5 años de experiencia. Diseño APIs y microservicios con Node.js y NestJS aplicando POO, SOLID y arquitectura hexagonal, e integro soluciones de IA (RAG, embeddings, bases vectoriales, guardrails) listas para producción. Automatizo infraestructura y pipelines CI/CD en AWS y Azure con Terraform y Docker, con seguridad integrada (OAuth2, JWT, Auth0, análisis estático) y observabilidad (Grafana, CloudWatch, DataDog). Traduzco las necesidades del negocio en decisiones técnicas claras y acompaño al equipo. Tengo base técnica en Java y Spring Boot (formación, aún no en producción).';
const BIO_EN = '☁️ Backend, Cloud and Generative AI Engineer with 5+ years of experience. I design APIs and microservices with Node.js and NestJS applying OOP, SOLID and hexagonal architecture, and integrate production-ready AI solutions (RAG, embeddings, vector databases, guardrails). I automate infrastructure and CI/CD pipelines on AWS and Azure with Terraform and Docker, with built-in security (OAuth2, JWT, Auth0, static analysis) and observability (Grafana, CloudWatch, DataDog). I translate business needs into clear technical decisions and support the team along the way. I have a technical foundation in Java and Spring Boot (training, not yet in production).';

const NEW_SKILLS_ES = ['DevSecOps', 'OWASP', 'SAST', 'OIDC', 'IAM', 'Gestión de secretos', 'Arquitectura hexagonal', 'SLOs', 'FinOps', 'LLMOps'];
const NEW_SKILLS_EN = ['DevSecOps', 'OWASP', 'SAST', 'OIDC', 'IAM', 'Secrets management', 'Hexagonal architecture', 'SLOs', 'FinOps', 'LLMOps'];

(async () => {
  const about = await client.fetch(`*[_type=="about"]{_id, language, skills}`);
  const patches = [];
  for (const a of about) {
    const add = a.language === 'en' ? NEW_SKILLS_EN : NEW_SKILLS_ES;
    const skills = [...new Set([...(a.skills || []), ...add])];
    patches.push({ id: a._id, set: { skills, bio: block(a.language === 'en' ? BIO_EN : BIO_ES) } });
  }
  patches.push({ id: '0422d1dd-a0fc-4e63-86a1-e386152f6fea', set: { role: 'Data Engineer' } });
  patches.push({ id: '26e5a6b9-c312-4995-a4c6-992b98668f50', set: { role: 'Data Engineer' } });

  console.log(patches.length, 'docs', APPLY ? '(APPLY)' : '(dry-run)');
  if (!APPLY) return patches.forEach((p) => console.log(' -', p.id, Object.keys(p.set)));
  let tx = client.transaction();
  for (const p of patches) tx = tx.patch(p.id, (x) => x.set(p.set));
  const r = await tx.commit();
  console.log('OK', r.transactionId);
})().catch((e) => { console.error(e.message); process.exit(1); });
