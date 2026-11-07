/**
 * Casos de estudio + ajustes de skills/bio.
 * Uso: node scripts/update-case-studies.cjs [--apply]
 * BORRADOR: valida roles, alcance y resultados antes de dejarlo público.
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

// ── About: Java solo como base técnica + herramientas demandadas ────────────
const SKILLS_ES = [
  'Node.js', 'NestJS', 'TypeScript', 'Python', 'FastAPI', 'GraphQL', 'APIs REST', 'Microservicios',
  'POO', 'SOLID', 'Clean Architecture', 'Domain-Driven Design', 'Patrones de diseño', 'Pruebas automatizadas',
  'IA Generativa', 'RAG', 'LangChain', 'LangGraph', 'Embeddings', 'Bases Vectoriales',
  'AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitLab CI/CD', 'GitHub Actions',
  'Kafka', 'RabbitMQ', 'Redis', 'Arquitectura orientada a eventos',
  'PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB',
  'React', 'Next.js', 'Vue.js', 'JavaScript',
  'JWT', 'OAuth2', 'Auth0', 'Grafana', 'Prometheus', 'OpenTelemetry', 'DataDog', 'CloudWatch',
  'Java (base técnica)', 'Spring Boot (base técnica)',
];
const EN_MAP = { 'APIs REST': 'REST APIs', 'Microservicios': 'Microservices', 'Patrones de diseño': 'Design Patterns', 'Pruebas automatizadas': 'Automated Testing', 'IA Generativa': 'Generative AI', 'Bases Vectoriales': 'Vector Databases', 'Arquitectura orientada a eventos': 'Event-driven Architecture', 'POO': 'OOP', 'Java (base técnica)': 'Java (technical foundation)', 'Spring Boot (base técnica)': 'Spring Boot (technical foundation)' };
const SKILLS_EN = SKILLS_ES.map((s) => EN_MAP[s] || s);

const BIO_ES = '☁️ Ingeniero Backend / Cloud & DevOps con más de 8 años de experiencia en desarrollo full-stack e IA generativa. Diseño APIs y microservicios con Node.js/NestJS aplicando POO, SOLID y arquitectura limpia, e integro soluciones de IA (RAG, embeddings, bases vectoriales, guardrails) listas para producción. Automatizo infraestructura y pipelines CI/CD en AWS/Azure con Terraform y Docker, con observabilidad (Grafana, CloudWatch, DataDog) y seguridad (JWT, OAuth2, Auth0). Me gusta traducir las necesidades del negocio en decisiones técnicas claras y guiar al equipo. Tengo base técnica en Java y Spring Boot (formación, aún no en producción).';
const BIO_EN = '☁️ Backend / Cloud & DevOps Engineer with 8+ years of experience in full-stack development and generative AI. I design APIs and microservices with Node.js/NestJS applying OOP, SOLID and clean architecture, and integrate production-ready AI solutions (RAG, embeddings, vector databases, guardrails). I automate infrastructure and CI/CD pipelines on AWS/Azure with Terraform and Docker, with observability (Grafana, CloudWatch, DataDog) and security (JWT, OAuth2, Auth0). I enjoy turning business needs into clear technical decisions and guiding the team. I have a technical foundation in Java and Spring Boot (training, not yet in production).';

// ── Casos de estudio (borrador) ─────────────────────────────────────────────
const CASES = [
  {
    ids: { es: 'fb42f623-1bd6-4395-bbff-c3ac127d3103', en: '7e797cf3-99ff-44db-b37c-b944481bef27' },
    es: {
      summary: 'Plataforma para planificar asuntos finales y dejar un legado digital: microservicios, IA generativa y entrega continua en la nube.',
      role: 'Backend Developer / Cloud & DevOps: APIs, infraestructura como código, integración de IA y pipelines CI/CD.',
      challenge: 'Ofrecer una plataforma que guarda información muy sensible y que además automatice tareas con IA, sin comprometer seguridad ni mantenibilidad mientras el producto crece.',
      decisions: [
        { title: 'Servicios modulares con NestJS y SOLID', body: 'Separé dominio, casos de uso e infraestructura con inyección de dependencias. Depender de abstracciones permite cambiar proveedores (base de datos, colas, modelos) sin tocar la lógica de negocio y probar cada pieza de forma aislada.', principles: ['NestJS', 'SOLID', 'Inyección de dependencias', 'Pruebas unitarias'] },
        { title: 'RAG con guardrails y evaluaciones', body: 'Pipeline de embeddings y búsqueda semántica en una base vectorial para responder con contexto propio, con guardrails de entrada/salida y evaluaciones para detectar respuestas fuera de alcance antes de llegar al usuario.', principles: ['RAG', 'LangChain', 'Embeddings', 'Bases vectoriales'] },
        { title: 'Infraestructura reproducible y despliegues seguros', body: 'Infraestructura como código con Terraform y pipelines CI/CD con Docker y análisis estático que bloquean despliegues con vulnerabilidades. La observabilidad (Grafana, CloudWatch, DataDog) permite detectar incidentes de forma proactiva.', principles: ['Terraform', 'Docker', 'CI/CD', 'Observabilidad'] },
      ],
      business: 'Aterricé las peticiones del negocio en alcance, riesgos y trade-offs concretos (por ejemplo, qué automatizar con IA primero y qué dejar con revisión humana) para acordar prioridades realistas antes de construir.',
      leadership: 'Propuse y documenté las decisiones de arquitectura, revisé código del equipo y dejé pipelines y plantillas de infraestructura que otras personas pueden mantener.',
      results: ['Despliegues repetibles y con controles de seguridad automáticos.', 'Funcionalidades de IA con límites y evaluación en lugar de depender solo del modelo.', 'Base de código modular lista para sumar nuevos servicios.'],
    },
    en: {
      summary: 'Platform to plan final affairs and leave a digital legacy: microservices, generative AI and continuous delivery in the cloud.',
      role: 'Backend Developer / Cloud & DevOps: APIs, infrastructure as code, AI integration and CI/CD pipelines.',
      challenge: 'Deliver a platform that stores highly sensitive information and also automates tasks with AI, without compromising security or maintainability as the product grows.',
      decisions: [
        { title: 'Modular services with NestJS and SOLID', body: 'I separated domain, use cases and infrastructure with dependency injection. Depending on abstractions lets us swap providers (database, queues, models) without touching business logic and test each piece in isolation.', principles: ['NestJS', 'SOLID', 'Dependency injection', 'Unit testing'] },
        { title: 'RAG with guardrails and evaluations', body: 'Embedding pipeline and semantic search over a vector database to answer with our own context, with input/output guardrails and evaluations to catch out-of-scope answers before they reach the user.', principles: ['RAG', 'LangChain', 'Embeddings', 'Vector databases'] },
        { title: 'Reproducible infrastructure and safe deployments', body: 'Infrastructure as code with Terraform and CI/CD pipelines with Docker and static analysis that block deployments with vulnerabilities. Observability (Grafana, CloudWatch, DataDog) surfaces incidents proactively.', principles: ['Terraform', 'Docker', 'CI/CD', 'Observability'] },
      ],
      business: 'I translated business requests into scope, risks and concrete trade-offs (for example, what to automate with AI first and what to keep under human review) to agree on realistic priorities before building.',
      leadership: 'I proposed and documented architecture decisions, reviewed teammates’ code and left pipelines and infrastructure templates others can maintain.',
      results: ['Repeatable deployments with automatic security gates.', 'AI features with limits and evaluation instead of relying on the model alone.', 'Modular codebase ready to add new services.'],
    },
  },
  {
    ids: { es: '4a5e4c4e-c3c5-4bd4-a940-9b6263031208', en: '53345b33-98f5-4dd1-8f29-6af9ed0878ea' },
    es: {
      summary: 'App móvil de PastPost para iOS y Android, apoyada en APIs NestJS con autenticación OAuth2.',
      role: 'Backend: diseño de los contratos de API y autenticación que consume la app.',
      challenge: 'Que la app móvil y la web compartan el mismo backend sin acoplarse, con sesiones seguras y datos consistentes aun con conectividad limitada.',
      decisions: [
        { title: 'Contratos de API estables', body: 'Definí DTOs y validación explícita en NestJS para que los cambios del backend no rompan versiones ya instaladas de la app.', principles: ['NestJS', 'DTOs', 'Versionado de API'] },
        { title: 'Autenticación con OAuth2/JWT', body: 'Tokens de corta duración con renovación, para reducir el riesgo si un dispositivo se compromete.', principles: ['OAuth2', 'JWT', 'Seguridad'] },
        { title: 'Sincronización tolerante a fallos', body: 'Operaciones idempotentes y reintentos para que un corte de red no duplique ni pierda datos.', principles: ['Idempotencia', 'Reintentos'] },
      ],
      business: 'Acordé con producto qué funciona sin conexión y qué requiere red, para fijar un alcance entregable en lugar de prometer todo offline.',
      leadership: 'Coordiné con quienes desarrollan la app los contratos de API y documenté los endpoints.',
      results: ['Un solo backend para web y móvil.', 'Cambios de API sin romper versiones instaladas.'],
    },
    en: {
      summary: 'PastPost mobile app for iOS and Android, backed by NestJS APIs with OAuth2 authentication.',
      role: 'Backend: API contracts and authentication consumed by the app.',
      challenge: 'Let the mobile app and the web share the same backend without coupling them, with secure sessions and consistent data even on limited connectivity.',
      decisions: [
        { title: 'Stable API contracts', body: 'I defined DTOs and explicit validation in NestJS so backend changes do not break already-installed app versions.', principles: ['NestJS', 'DTOs', 'API versioning'] },
        { title: 'OAuth2/JWT authentication', body: 'Short-lived tokens with refresh, reducing risk if a device is compromised.', principles: ['OAuth2', 'JWT', 'Security'] },
        { title: 'Failure-tolerant sync', body: 'Idempotent operations and retries so a network drop never duplicates or loses data.', principles: ['Idempotency', 'Retries'] },
      ],
      business: 'I agreed with product on what works offline and what requires network, to set a deliverable scope instead of promising everything offline.',
      leadership: 'I coordinated API contracts with the app developers and documented the endpoints.',
      results: ['A single backend for web and mobile.', 'API changes without breaking installed versions.'],
    },
  },
  {
    ids: { es: '003a6c24-27e4-4d2a-9db8-9b09b8f16041', en: 'eee5a5f7-b32a-48ac-8bef-280b90f7bdd8' },
    es: {
      summary: 'Portal e-commerce de Liverpool con Next.js sobre micro-frontends, contenido headless y CDN.',
      role: 'Desarrollo full-stack sobre el portal: interfaces en React/Next.js e integración con servicios backend.',
      challenge: 'Un portal de alto tráfico donde varios equipos publican cambios a la vez, sin que una entrega rompa a las demás ni degrade el rendimiento.',
      decisions: [
        { title: 'Micro-frontends con fronteras claras', body: 'Cada área evoluciona y se despliega por separado con contratos explícitos entre módulos, lo que reduce el acoplamiento entre equipos.', principles: ['Next.js', 'React', 'Micro-frontends'] },
        { title: 'Contenido headless y entrega por CDN', body: 'Separar contenido (Contentstack) de presentación y servir por CDN (Akamai) mejora la velocidad de cambios editoriales y la latencia percibida.', principles: ['Contentstack', 'Akamai CDN', 'Caching'] },
        { title: 'Monitoreo con Dynatrace', body: 'Telemetría de frontend y backend para priorizar mejoras con datos reales.', principles: ['Dynatrace', 'Observabilidad'] },
      ],
      business: 'Equilibré las campañas comerciales con la estabilidad técnica, negociando ventanas de cambio y alcance para no arriesgar fechas clave.',
      leadership: 'Compartí criterios de calidad y revisión de código con el equipo.',
      results: ['Entregas independientes por área.', 'Decisiones de rendimiento guiadas por métricas.'],
    },
    en: {
      summary: 'Liverpool e-commerce portal built with Next.js on micro-frontends, headless content and a CDN.',
      role: 'Full-stack development on the portal: React/Next.js interfaces and integration with backend services.',
      challenge: 'A high-traffic portal where several teams ship at the same time, without one release breaking others or degrading performance.',
      decisions: [
        { title: 'Micro-frontends with clear boundaries', body: 'Each area evolves and deploys separately with explicit contracts between modules, reducing coupling between teams.', principles: ['Next.js', 'React', 'Micro-frontends'] },
        { title: 'Headless content and CDN delivery', body: 'Separating content (Contentstack) from presentation and serving through a CDN (Akamai) speeds up editorial changes and perceived latency.', principles: ['Contentstack', 'Akamai CDN', 'Caching'] },
        { title: 'Monitoring with Dynatrace', body: 'Frontend and backend telemetry to prioritize improvements with real data.', principles: ['Dynatrace', 'Observability'] },
      ],
      business: 'I balanced commercial campaigns with technical stability, negotiating change windows and scope so key dates were not put at risk.',
      leadership: 'I shared quality criteria and code review practices with the team.',
      results: ['Independent releases per area.', 'Performance decisions guided by metrics.'],
    },
  },
  {
    ids: { es: '5f9f2c63-8a85-4412-9248-88ec173942c5', en: '2499ac85-2769-4608-b8e4-dc8803e80071' },
    es: {
      summary: 'Plataforma de seguros (auto, GMM, mascota, PIF y hogar) con cotizador en tiempo real y gestión de pólizas.',
      role: 'Full-stack: SPA en React y servicios backend en Node.js.',
      challenge: 'Cinco productos de seguro con reglas distintas, que debían compartir experiencia, cotizador y gestión de pólizas sin duplicar código.',
      decisions: [
        { title: 'Dominio por producto con abstracciones comunes', body: 'Modelé cada seguro como una estrategia detrás de una interfaz común de cotización: agregar un producto no obliga a modificar los existentes (principio abierto/cerrado).', principles: ['POO', 'SOLID', 'Strategy pattern'] },
        { title: 'SPA rápida con React y Vite', body: 'Aplicación de una sola página con builds ágiles y componentes reutilizables entre los flujos de cotización.', principles: ['React', 'Vite'] },
        { title: 'Servicios desacoplados', body: 'Backend en Node.js con PostgreSQL y servicios separados por responsabilidad, monitoreados con Dynatrace.', principles: ['Node.js', 'PostgreSQL', 'Microservicios'] },
      ],
      business: 'Con las áreas de seguros fui aclarando reglas de cotización ambiguas y negociando qué entraba en cada entrega para liberar valor por etapas.',
      leadership: 'Documenté el modelo de cotización para que otras personas pudieran agregar productos.',
      results: ['Un cotizador común para varios productos.', 'Alta de nuevos productos sin reescribir los existentes.'],
    },
    en: {
      summary: 'Insurance platform (auto, major medical, pet, PIF and home) with real-time quoting and policy management.',
      role: 'Full-stack: React SPA and Node.js backend services.',
      challenge: 'Five insurance products with different rules that had to share experience, quoting and policy management without duplicating code.',
      decisions: [
        { title: 'Per-product domain behind common abstractions', body: 'I modeled each insurance type as a strategy behind a common quoting interface: adding a product does not require modifying existing ones (open/closed principle).', principles: ['OOP', 'SOLID', 'Strategy pattern'] },
        { title: 'Fast SPA with React and Vite', body: 'Single-page app with quick builds and components reused across quoting flows.', principles: ['React', 'Vite'] },
        { title: 'Decoupled services', body: 'Node.js backend with PostgreSQL and services split by responsibility, monitored with Dynatrace.', principles: ['Node.js', 'PostgreSQL', 'Microservices'] },
      ],
      business: 'I worked with the insurance teams to clarify ambiguous quoting rules and negotiate what went into each release so value shipped in stages.',
      leadership: 'I documented the quoting model so others could add products.',
      results: ['A shared quoter across several products.', 'New products added without rewriting existing ones.'],
    },
  },
  {
    ids: { es: 'a9f38f50-4851-4f5d-a206-28552da1af62', en: '98f79b9a-cad2-4c1e-b9e3-e78791e25b4f' },
    es: {
      summary: 'Portal de seguros de Suburbia con directorio de agentes, cotizador y contratación.',
      role: 'Full-stack: frontend en Next.js y backend en Node.js.',
      challenge: 'Dar a clientes y agentes un solo portal que se integre con sistemas existentes y proteja el acceso a datos personales.',
      decisions: [
        { title: 'Autenticación delegada a Auth0', body: 'Delegar identidad en Auth0 (OAuth2/OIDC) evita reimplementar seguridad sensible y permite roles para clientes y agentes.', principles: ['Auth0', 'OAuth2', 'Roles'] },
        { title: 'Next.js con Material UI', body: 'Renderizado en servidor para velocidad inicial y SEO, con componentes consistentes y accesibles.', principles: ['Next.js', 'Material UI'] },
        { title: 'Integración con sistemas existentes', body: 'Capas de adaptación que aíslan los sistemas heredados de la lógica del portal.', principles: ['Adapter pattern', 'Node.js', 'PostgreSQL'] },
      ],
      business: 'Alineé con negocio el orden de los módulos (directorio, cotizador y contratación) para liberar primero lo que más valor aportaba.',
      leadership: 'Acordé convenciones de código y pipeline de entrega con GitLab CI/CD.',
      results: ['Un portal único para clientes y agentes.', 'Acceso controlado por roles.'],
    },
    en: {
      summary: 'Suburbia insurance portal with agent directory, quoter and contracting.',
      role: 'Full-stack: Next.js frontend and Node.js backend.',
      challenge: 'Give customers and agents a single portal that integrates with existing systems and protects access to personal data.',
      decisions: [
        { title: 'Authentication delegated to Auth0', body: 'Delegating identity to Auth0 (OAuth2/OIDC) avoids re-implementing sensitive security and enables roles for customers and agents.', principles: ['Auth0', 'OAuth2', 'Roles'] },
        { title: 'Next.js with Material UI', body: 'Server rendering for fast first load and SEO, with consistent, accessible components.', principles: ['Next.js', 'Material UI'] },
        { title: 'Integration with existing systems', body: 'Adapter layers that isolate legacy systems from the portal logic.', principles: ['Adapter pattern', 'Node.js', 'PostgreSQL'] },
      ],
      business: 'I aligned the module order (directory, quoter, contracting) with the business to ship the highest-value pieces first.',
      leadership: 'I agreed on code conventions and the GitLab CI/CD delivery pipeline.',
      results: ['A single portal for customers and agents.', 'Role-based access control.'],
    },
  },
];

const patches = [
  { id: 'about-singleton', set: { skills: SKILLS_ES, bio: block(BIO_ES) } },
  { id: 'about-singleton-en', set: { skills: SKILLS_EN, bio: block(BIO_EN) } },
];
for (const c of CASES) {
  for (const lang of ['es', 'en']) patches.push({ id: c.ids[lang], set: { caseStudy: c[lang] }, unset: ['longDescription'] });
}

(async () => {
  console.log(`${patches.length} docs (${APPLY ? 'APPLY' : 'dry-run'})`);
  if (!APPLY) return patches.forEach((p) => console.log(' -', p.id, Object.keys(p.set).join(',')));
  let tx = client.transaction();
  for (const p of patches) tx = tx.patch(p.id, (x) => (p.unset ? x.set(p.set).unset(p.unset) : x.set(p.set)));
  const r = await tx.commit();
  console.log('OK', r.transactionId, r.results.length);
})().catch((e) => { console.error(e.message); process.exit(1); });
