/**
 * Sincroniza el contenido de Sanity con el CV (Nov 2026) y con el stack real
 * detectado en cada proyecto desplegado.
 *
 * Uso:  node scripts/update-from-cv.cjs            -> dry-run (solo muestra)
 *       node scripts/update-from-cv.cjs --apply    -> aplica los cambios
 *
 * Token: SANITY_TOKEN o, si no existe, el authToken del `sanity login` local.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

function getToken() {
  if (process.env.SANITY_TOKEN) return process.env.SANITY_TOKEN;
  const candidates = [
    path.join(os.homedir(), '.config', 'sanity', 'config.json'),
    path.join(process.env.APPDATA || '', 'sanity', 'config.json'),
  ];
  for (const f of candidates) {
    try { return JSON.parse(fs.readFileSync(f, 'utf8')).authToken; } catch (_) {}
  }
  throw new Error('No hay token de Sanity (SANITY_TOKEN o `sanity login`).');
}

const APPLY = process.argv.includes('--apply');
const client = createClient({
  projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01',
  useCdn: false, token: getToken(),
});

const block = (key, text) => [{
  _key: key, _type: 'block', style: 'normal', markDefs: [],
  children: [{ _key: key + '-s', _type: 'span', marks: [], text }],
}];

// ── Skills (CV + Java/Spring) ───────────────────────────────────────────────
const SKILLS_ES = [
  'Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'Maven', 'JUnit',
  'Node.js', 'NestJS', 'Python', 'FastAPI', 'GraphQL', 'APIs REST', 'Microservicios',
  'IA Generativa', 'RAG', 'LangChain', 'LangGraph', 'Embeddings', 'Bases Vectoriales',
  'React', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript',
  'AWS', 'Azure', 'Docker', 'Terraform', 'GitLab CI/CD', 'GitHub Actions',
  'PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB',
  'JWT', 'OAuth2', 'Auth0', 'Observabilidad',
];
const SKILLS_EN = SKILLS_ES.map((s) => ({
  'APIs REST': 'REST APIs', 'Microservicios': 'Microservices', 'IA Generativa': 'Generative AI',
  'Bases Vectoriales': 'Vector Databases', 'Observabilidad': 'Observability',
}[s] || s));

const BIO_ES = '☁️ Ingeniero Backend / Cloud & DevOps con más de 8 años de experiencia en desarrollo full-stack e IA generativa: APIs, microservicios y aplicaciones web escalables, seguras y listas para producción. Trabajo con Java y Spring Boot (1 año), Node.js/NestJS, Python (FastAPI) y GraphQL en el backend, y con React, Next.js y TypeScript en el frontend. Diseño pipelines CI/CD en AWS/Azure con Docker y Terraform, e integro IA generativa (RAG, embeddings, bases vectoriales, guardrails) con observabilidad (Grafana, CloudWatch, DataDog) y controles de seguridad (JWT, OAuth2, Auth0). He trabajado en PastPost, Promass y Banco Azteca.';
const BIO_EN = '☁️ Backend / Cloud & DevOps Engineer with 8+ years of experience in full-stack development and generative AI: scalable, secure, production-ready APIs, microservices and web apps. I work with Java and Spring Boot (1 year), Node.js/NestJS, Python (FastAPI) and GraphQL on the backend, and React, Next.js and TypeScript on the frontend. I design CI/CD pipelines on AWS/Azure with Docker and Terraform, and integrate generative AI (RAG, embeddings, vector databases, guardrails) with observability (Grafana, CloudWatch, DataDog) and security controls (JWT, OAuth2, Auth0). I have worked at PastPost, Promass and Banco Azteca.';

const TITLE = 'Cloud & DevOps Engineer | Backend Developer';

// ── Experience (solo lo que dice el CV, sin métricas inventadas) ────────────
const EXP = {
  pastpost: {
    es: { id: '533061c8-06c5-4d5f-b4bc-f46717e5c5d3', role: 'Backend Developer / Cloud & DevOps',
      description: 'Diseño y desarrollo microservicios y APIs escalables en Node.js (NestJS) y Python (FastAPI) optimizados para Azure/AWS, con infraestructura como código reproducible en Terraform. Diseño soluciones con IA generativa: flujos RAG, embeddings y búsqueda semántica en bases vectoriales. Construyo interfaces con Next.js, React y TypeScript. Incorporo evaluaciones, guardrails y observabilidad (Grafana, CloudWatch, DataDog) para resolver incidentes de forma proactiva, y optimizo pipelines CI/CD con Docker y controles de seguridad que bloquean despliegues con vulnerabilidades.' },
    en: { id: 'bf9d9ff7-7d76-4b5f-aedc-d8d3d5107cc5', role: 'Backend Developer / Cloud & DevOps',
      description: 'I design and build scalable microservices and APIs in Node.js (NestJS) and Python (FastAPI), optimized for Azure/AWS, with reproducible infrastructure as code in Terraform. I design generative-AI solutions: RAG flows, embeddings and semantic search over vector databases. I build interfaces with Next.js, React and TypeScript. I add evaluations, guardrails and observability (Grafana, CloudWatch, DataDog) to resolve incidents proactively, and optimize CI/CD pipelines with Docker and security gates that block deployments with vulnerabilities.' },
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Python', 'FastAPI', 'LangChain', 'RAG', 'Terraform', 'AWS', 'Azure', 'Docker', 'Grafana', 'DataDog'],
  },
  promass: {
    es: { id: 'cff4b0dd-20d5-4878-8cb8-b54b81201b97', role: 'Full-Stack / Backend-DevOps',
      description: 'Lideré las soluciones backend, la administración de bases de datos, el diseño de APIs RESTful y GraphQL y los pipelines automatizados en GitLab CI/CD. Desarrollé interfaces frontend fluidas y responsivas con React.js y Vue.js. Diseñé modelos relacionales optimizados e integré ORMs para agilizar el desarrollo y mantenimiento. Sistematicé las pruebas automatizadas y el despliegue con Docker, y aseguré la resiliencia con DLQs y circuit breakers.' },
    en: { id: '6b4108b8-2cc5-4b66-9ef5-1101c7d5997e', role: 'Full-Stack / Backend-DevOps',
      description: 'Led backend solutions, database administration, RESTful and GraphQL API design, and automated pipelines in GitLab CI/CD. Built fluid, responsive frontends with React.js and Vue.js. Designed optimized relational models and integrated ORMs to speed up development and maintenance. Systematized automated testing and Docker-based deployment, and ensured resilience with DLQs and circuit breakers.' },
    skills: ['React', 'Vue.js', 'JavaScript', 'Node.js', 'PHP', 'GraphQL', 'PostgreSQL', 'SQL Server', 'GitLab CI/CD', 'Docker'],
    endDate: '2025-07-01',
  },
  azteca: {
    es: { id: '0422d1dd-a0fc-4e63-86a1-e386152f6fea', role: 'Data Backend Engineer',
      description: 'Desarrollé y reestructuré consultas complejas, Stored Procedures y Triggers para optimizar el rendimiento de transacciones en sistemas de banca digital. Diseñé modelos de datos relacionales y NoSQL de alta escala para métricas y telemetría bajo estrictas normas de seguridad. Automaticé migraciones de datos, respaldos periódicos y planes de recuperación ante desastres (Disaster Recovery) con scripts en Bash y Python.' },
    en: { id: '26e5a6b9-c312-4995-a4c6-992b98668f50', role: 'Data Backend Engineer',
      description: 'Developed and restructured complex queries, Stored Procedures and Triggers to optimize transaction performance in digital banking systems. Designed high-scale relational and NoSQL data models for metrics and telemetry under strict security standards. Automated data migrations, periodic backups and Disaster Recovery plans with Bash and Python scripts.' },
    skills: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'Bash', 'Python', 'Data Architecture'],
  },
};

// ── Projects (stack verificado con DevTools / headers) ──────────────────────
const PROJ = [
  { // PastPost portal: Next.js servido vía CloudFront (AWS)
    ids: { es: 'fb42f623-1bd6-4395-bbff-c3ac127d3103', en: '7e797cf3-99ff-44db-b37c-b944481bef27' },
    stack: ['Next.js', 'React', 'TypeScript', 'NestJS', 'Python', 'AWS', 'Terraform', 'Docker', 'RAG'],
    es: { title: 'PastPost – Legado digital', description: 'Plataforma para planificar asuntos finales y dejar un legado digital. Frontend en Next.js (SSR/ISR) servido vía AWS CloudFront; backend de microservicios en NestJS y Python con IaC en Terraform e IA generativa (RAG).' },
    en: { title: 'PastPost – Digital Legacy', description: 'Platform to plan final affairs and leave a digital legacy. Next.js frontend (SSR/ISR) served through AWS CloudFront; NestJS and Python microservices backend with Terraform IaC and generative AI (RAG).' },
  },
  { // App móvil
    ids: { es: '4a5e4c4e-c3c5-4bd4-a940-9b6263031208', en: '53345b33-98f5-4dd1-8f29-6af9ed0878ea' },
    stack: ['React Native', 'TypeScript', 'NestJS', 'Node.js', 'OAuth2'],
    es: { title: 'PastPost App – iOS & Android', description: 'App móvil de PastPost en iOS y Android con React Native. Consume las APIs en NestJS, con autenticación OAuth2 y sincronización de datos con soporte offline.' },
    en: { title: 'PastPost App – iOS & Android', description: 'PastPost mobile app for iOS and Android built with React Native. Consumes the NestJS APIs, with OAuth2 authentication and data sync with offline support.' },
  },
  { // Liverpool: Next.js, micro-frontends, Contentstack, Akamai, Dynatrace
    ids: { es: '003a6c24-27e4-4d2a-9db8-9b09b8f16041', en: 'eee5a5f7-b32a-48ac-8bef-280b90f7bdd8' },
    stack: ['Next.js', 'React', 'Micro-frontends', 'Contentstack', 'Akamai CDN', 'Dynatrace'],
    es: { title: 'Liverpool – Portal E-commerce de Retail', description: 'Portal e-commerce de Liverpool.com.mx construido con Next.js y React sobre una arquitectura de micro-frontends, contenido headless en Contentstack, entrega vía Akamai CDN y monitoreo con Dynatrace.' },
    en: { title: 'Liverpool – Retail E-commerce Portal', description: 'Liverpool.com.mx e-commerce portal built with Next.js and React on a micro-frontend architecture, headless content in Contentstack, delivery through Akamai CDN and Dynatrace monitoring.' },
  },
  { // Mi Seguro: SPA Vite
    ids: { es: '5f9f2c63-8a85-4412-9248-88ec173942c5', en: '2499ac85-2769-4608-b8e4-dc8803e80071' },
    stack: ['React', 'Vite', 'Node.js', 'PostgreSQL', 'Microservicios', 'AWS', 'Dynatrace'],
    es: { title: 'Mi Seguro Liverpool – Plataforma de Seguros', description: 'Plataforma de seguros (auto, GMM, mascota, PIF y hogar) como SPA en React + Vite, con cotizador en tiempo real, gestión de pólizas y reclamos sobre microservicios en Node.js y PostgreSQL, monitoreada con Dynatrace.' },
    en: { title: 'Mi Seguro Liverpool – Insurance Platform', description: 'Insurance platform (auto, major medical, pet, PIF and home) as a React + Vite SPA, with real-time quoting, policy and claims management on Node.js microservices and PostgreSQL, monitored with Dynatrace.' },
  },
  { // Suburbia: Next.js + MUI + Auth0
    ids: { es: 'a9f38f50-4851-4f5d-a206-28552da1af62', en: '98f79b9a-cad2-4c1e-b9e3-e78791e25b4f' },
    stack: ['Next.js', 'React', 'Material UI', 'Auth0', 'Node.js', 'PostgreSQL', 'GitLab CI/CD'],
    es: { title: 'Suburbia – Plataforma Integral de Seguros', description: 'Portal de seguros para Suburbia con directorio de agentes, cotizador y contratación. Frontend en Next.js con Material UI, autenticación con Auth0 y backend en Node.js con PostgreSQL, desplegado con GitLab CI/CD.' },
    en: { title: 'Suburbia – Comprehensive Insurance Platform', description: 'Insurance portal for Suburbia with agent directory, quoter and contracting. Next.js frontend with Material UI, Auth0 authentication and a Node.js backend with PostgreSQL, deployed with GitLab CI/CD.' },
  },
];

const patches = [];
const add = (id, set) => patches.push({ id, set });

// About
add('about-singleton',    { title: TITLE, skills: SKILLS_ES, bio: block('bio-1', BIO_ES) });
add('about-singleton-en', { title: TITLE, skills: SKILLS_EN, bio: block('bio-1', BIO_EN) });

// Experience
for (const e of Object.values(EXP)) {
  for (const lang of ['es', 'en']) {
    const set = { role: e[lang].role, description: e[lang].description, skills: e.skills };
    if (e.endDate) set.endDate = e.endDate;
    add(e[lang].id, set);
  }
}

// Projects
for (const p of PROJ) {
  for (const lang of ['es', 'en']) {
    add(p.ids[lang], { ...p[lang], longDescription: p[lang].description, stack: p.stack });
  }
}

(async () => {
  console.log(`${patches.length} documentos a actualizar (${APPLY ? 'APPLY' : 'dry-run'})`);
  if (!APPLY) {
    patches.forEach((p) => console.log(' -', p.id, Object.keys(p.set).join(',')));
    return;
  }
  let tx = client.transaction();
  for (const p of patches) tx = tx.patch(p.id, (x) => x.set(p.set));
  const res = await tx.commit();
  console.log('OK, transacción', res.transactionId, '— docs:', res.results.length);
})().catch((e) => { console.error(e.message); process.exit(1); });
