/**
 * Enlaza las herramientas que quedaban sin caso, según lo indicado por el autor:
 *  - Liverpool e-commerce: FastAPI, GraphQL, MongoDB, Redis (+ OWASP)
 *  - Mi Seguro Liverpool: OWASP
 *  - PastPost web y móvil: LangGraph, Semantic Kernel, OpenAI API
 *  - PastPost web: Azure, GitHub Actions, OpenTelemetry, Hardhat, Foundry, ethers.js
 * Los textos son un borrador desde lo indicado: validar detalles (p. ej. para qué se usa Azure).
 * Idempotente. Uso: node scripts/link-remaining-tools.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });
const dec = (key, title, body, principles) => ({ _key: key, _type: 'decision', title, body, principles });

const root = path.join(__dirname, '..', '..', 'frontend', 'messages');
const msgs = { es: JSON.parse(fs.readFileSync(path.join(root, 'es.json'), 'utf8')), en: JSON.parse(fs.readFileSync(path.join(root, 'en.json'), 'utf8')) };
const enName = {};
msgs.es.capabilities.items.forEach((it, i) => it.tools.forEach((t, j) => { enName[t] = msgs.en.capabilities.items[i].tools[j]; }));
const nm = (lang, t) => (lang === 'en' ? enName[t] || t : t);

const STACK_ADD = {
  'liverpool-ecommerce': ['FastAPI', 'GraphQL', 'MongoDB', 'Redis', 'OWASP'],
  'liverpool-seguros': ['OWASP'],
  'pastpost-social-network': ['LangGraph', 'Semantic Kernel', 'OpenAI API', 'Azure', 'GitHub Actions', 'OpenTelemetry', 'Hardhat', 'Foundry', 'ethers.js'],
  'pastpost-mobile': ['LangGraph', 'Semantic Kernel', 'OpenAI API'],
};

// Decisiones nuevas (se insertan después de la clave indicada) y reemplazos de cuerpo por clave.
const NEW_DECISIONS = {
  'liverpool-ecommerce': {
    es: { after: 'headless-cdn', list: [
      dec('datos-apis', 'Capa de datos y APIs para los micro-frontends',
        'Los micro-frontends consumen los datos a través de GraphQL, que agrega varios servicios en una sola consulta y deja que cada área pida solo los campos que necesita; el esquema, versionado, sirve de contrato entre equipos. Detrás, servicios en FastAPI exponen las capacidades de dominio, MongoDB guarda los datos de forma de documento donde un modelo flexible lo favorece y Redis acelera las lecturas frecuentes y absorbe los picos.\n\nLos costos se gestionan de forma explícita: GraphQL exige limitar la profundidad y el costo de las consultas y evitar el problema N+1; el caché necesita una estrategia clara de expiración e invalidación para no servir datos obsoletos, y lo personalizado se guarda por usuario, nunca compartido.',
        ['GraphQL', 'FastAPI', 'MongoDB', 'Redis', 'Contratos entre equipos']),
      dec('seguridad-owasp', 'Seguridad de APIs según OWASP',
        'Las APIs se endurecen siguiendo OWASP API Security: validación estricta de cada entrada, autorización a nivel de objeto para que un usuario solo acceda a lo suyo, límites de uso contra abuso y mensajes de error que no revelan detalles internos. En GraphQL se limitan profundidad y complejidad de consulta y se desactiva la introspección en producción. Estos controles corren en el pipeline y no solo en revisiones puntuales.',
        ['OWASP', 'Autorización por objeto', 'Rate limiting', 'Validación de entrada']),
    ] },
    en: { after: 'headless-cdn', list: [
      dec('datos-apis', 'Data and API layer for the micro-frontends',
        'Micro-frontends consume data through GraphQL, which aggregates several services into one query and lets each area request only the fields it needs; the versioned schema acts as a contract between teams. Behind it, FastAPI services expose domain capabilities, MongoDB stores document-shaped data where a flexible model fits, and Redis speeds up frequent reads and absorbs peaks.\n\nThe costs are managed explicitly: GraphQL requires limiting query depth and cost and avoiding the N+1 problem; caching needs a clear expiry and invalidation strategy to avoid serving stale data, and personalized data is stored per user, never shared.',
        ['GraphQL', 'FastAPI', 'MongoDB', 'Redis', 'Contracts between teams']),
      dec('seguridad-owasp', 'API security following OWASP',
        'APIs are hardened following OWASP API Security: strict validation of every input, object-level authorization so a user only accesses their own data, rate limits against abuse and error messages that reveal no internal detail. In GraphQL, query depth and complexity are limited and introspection is disabled in production. These controls run in the pipeline, not only in one-off reviews.',
        ['OWASP', 'Object-level authorization', 'Rate limiting', 'Input validation']),
    ] },
  },
  'liverpool-seguros': {
    es: { after: 'servicios', list: [
      dec('seguridad-owasp', 'Seguridad de APIs y datos de clientes según OWASP',
        'Al manejar datos personales y de pólizas, las APIs siguen OWASP API Security: validación de cada entrada, autorización a nivel de objeto para que una persona solo vea sus propias pólizas y reclamos, límites de uso, registros de auditoría y exposición mínima de datos personales en las respuestas. Los controles se automatizan en el pipeline para que corran en cada cambio.',
        ['OWASP', 'Autorización por objeto', 'Auditoría', 'Datos personales mínimos']),
    ] },
    en: { after: 'servicios', list: [
      dec('seguridad-owasp', 'API and customer data security following OWASP',
        'Since the platform handles personal and policy data, APIs follow OWASP API Security: validation of every input, object-level authorization so a person only sees their own policies and claims, rate limits, audit logs and minimal exposure of personal data in responses. Controls are automated in the pipeline so they run on every change.',
        ['OWASP', 'Object-level authorization', 'Audit', 'Minimal personal data']),
    ] },
  },
};

// Reemplazos completos de cuerpo en decisiones existentes de PastPost web.
const BODY_REPLACE = {
  'pastpost-social-network': {
    es: {
      rag: {
        body: 'Pipeline de embeddings y búsqueda semántica sobre una base vectorial para responder con contexto propio. Los flujos de agente se orquestan con LangGraph (nodos y estados explícitos, con pasos de verificación) y, donde el servicio lo pedía, con Semantic Kernel. El modelo se consume por la API de OpenAI detrás de una interfaz propia, para poder cambiar de proveedor o de modelo sin tocar la lógica.\n\nHay guardrails de entrada y salida, y evaluaciones que detectan respuestas fuera de alcance o poco fieles a las fuentes antes de que lleguen al usuario. El costo y la latencia por consulta se miden, porque en IA un cambio de prompt o de modelo también es un cambio de producción.',
        add: ['LangGraph', 'Semantic Kernel', 'OpenAI API', 'Guardrails', 'Evals'],
      },
      infra: {
        body: 'Toda la infraestructura se define como código con Terraform, en AWS y también en Azure donde parte de la plataforma lo requiere, y se despliega con pipelines CI/CD (incluido GitHub Actions) que ejecutan análisis estático y de dependencias y bloquean el paso a producción ante vulnerabilidades.\n\nLa observabilidad se instrumenta con OpenTelemetry para correlacionar trazas, métricas y registros entre servicios, y se visualiza con CloudWatch (métricas, registros y alarmas) y paneles en Grafana o DataDog. Las colas de mensajes fallidos y la conciliación tienen alertas propias para enterarse antes que el usuario.',
        add: ['Azure', 'GitHub Actions', 'OpenTelemetry'],
      },
      'blockchain-policies': {
        append: '\n\nEn el desarrollo, los contratos se prueban con Hardhat y Foundry, incluidos los casos límite, y el backend los consume con ethers.js.',
        marker: 'Hardhat',
        add: ['Hardhat', 'Foundry', 'ethers.js', 'OpenZeppelin'],
      },
    },
    en: {
      rag: {
        body: 'Embedding pipeline and semantic search over a vector database to answer with our own context. Agent flows are orchestrated with LangGraph (explicit nodes and states, with verification steps) and, where the service called for it, with Semantic Kernel. The model is consumed through the OpenAI API behind our own interface, so the provider or model can change without touching the logic.\n\nThere are input and output guardrails, and evaluations that catch out-of-scope or source-unfaithful answers before they reach the user. Cost and latency per query are measured, because in AI a prompt or model change is also a production change.',
        add: ['LangGraph', 'Semantic Kernel', 'OpenAI API', 'Guardrails', 'Evals'],
      },
      infra: {
        body: 'All infrastructure is defined as code with Terraform, on AWS and also on Azure where part of the platform requires it, and deployed through CI/CD pipelines (including GitHub Actions) that run static and dependency analysis and block promotion to production on vulnerabilities.\n\nObservability is instrumented with OpenTelemetry to correlate traces, metrics and logs across services, and visualized with CloudWatch (metrics, logs and alarms) and Grafana or DataDog dashboards. Dead-letter queues and reconciliation have their own alerts so we hear about problems before users do.',
        add: ['Azure', 'GitHub Actions', 'OpenTelemetry'],
      },
      'blockchain-policies': {
        append: '\n\nIn development, contracts are tested with Hardhat and Foundry, including edge cases, and the backend consumes them with ethers.js.',
        marker: 'Hardhat',
        add: ['Hardhat', 'Foundry', 'ethers.js', 'OpenZeppelin'],
      },
    },
  },
  'pastpost-mobile': {
    es: { 'backend-compartido': { append: '\n\nLas funciones de IA (LangGraph, Semantic Kernel y la API de OpenAI) viven en ese mismo backend y la app solo las consume a través de la API.', marker: 'LangGraph', add: ['LangGraph', 'Semantic Kernel', 'OpenAI API'] } },
    en: { 'backend-compartido': { append: '\n\nThe AI features (LangGraph, Semantic Kernel and the OpenAI API) live in that same backend and the app only consumes them through the API.', marker: 'LangGraph', add: ['LangGraph', 'Semantic Kernel', 'OpenAI API'] } },
  },
};

(async () => {
  const slugs = Object.keys(STACK_ADD);
  const docs = await client.fetch('*[_type=="project" && slug.current in $slugs]{_id, language, "slug": slug.current, stack, caseStudy}', { slugs });
  for (const d of docs) {
    const lang = d.language === 'en' ? 'en' : 'es';
    const cs = JSON.parse(JSON.stringify(d.caseStudy));
    let decisions = cs.decisions || [];

    const repl = (BODY_REPLACE[d.slug] || {})[lang] || {};
    for (const [key, r] of Object.entries(repl)) {
      const x = decisions.find((y) => y._key === key);
      if (!x) { console.warn('missing decision', d.slug, key); continue; }
      if (r.body) x.body = r.body;
      if (r.append && !(x.body || '').includes(r.marker)) x.body = (x.body || '') + r.append;
      x.principles = [...new Set([...(x.principles || []), ...(r.add || [])])];
    }

    const nd = (NEW_DECISIONS[d.slug] || {})[lang];
    if (nd) {
      const keys = new Set(nd.list.map((x) => x._key));
      decisions = decisions.filter((x) => !keys.has(x._key));
      const at = decisions.findIndex((x) => x._key === nd.after);
      decisions = at === -1 ? [...decisions, ...nd.list] : [...decisions.slice(0, at + 1), ...nd.list, ...decisions.slice(at + 1)];
    }
    cs.decisions = decisions;

    const stack = [...new Set([...(d.stack || []), ...STACK_ADD[d.slug].map((t) => nm(lang, t))])];
    await client.patch(d._id).set({ stack, caseStudy: cs }).commit();
    console.log('updated', d.slug, lang, `(${decisions.length} decisions, ${stack.length} tools)`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
