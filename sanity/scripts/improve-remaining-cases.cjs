/**
 * Mejora los casos restantes (Liverpool e-commerce, Mi Seguro Liverpool, Suburbia) y enlaza
 * herramientas de Capacidades con los casos donde el contenido ya las respalda.
 * BORRADOR basado en lo que ya decía cada caso: validar detalles de implementación antes de publicar.
 * Idempotente. Uso: node scripts/improve-remaining-cases.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });
const dec = (key, title, body, principles) => ({ _key: key, _type: 'decision', title, body, principles });

// ───────────────────────── Liverpool – E-commerce ─────────────────────────
const ECOM = {
  es: {
    description: 'Portal de e-commerce de Liverpool.com.mx, de alto tráfico y con varios equipos publicando a la vez. Next.js y React sobre micro-frontends que se despliegan por área, contenido headless en Contentstack, entrega por CDN con Akamai y observabilidad con Dynatrace.',
    stack: ['Next.js', 'React', 'Micro-frontends', 'Contentstack', 'Akamai CDN', 'Dynatrace', 'Caching', 'Core Web Vitals'],
    cs: {
      summary: 'Portal de e-commerce de alto tráfico: Next.js sobre micro-frontends que se despliegan por área, contenido headless, entrega por CDN y decisiones de rendimiento guiadas por métricas reales.',
      role: 'Desarrollo full-stack sobre el portal: interfaces en React y Next.js, integración con servicios backend y trabajo de rendimiento junto a los equipos de cada área.',
      challenge: 'Un portal de retail con tráfico alto y picos por campañas, donde varios equipos publican cambios en paralelo. Cada entrega debía poder salir sola, sin romper a las demás y sin degradar el rendimiento que el usuario percibe.',
      decisions: [
        dec('micro-frontends', 'Micro-frontends con fronteras claras',
          'El portal se divide por área de negocio y cada una se construye, prueba y despliega por separado. Las fronteras siguen al negocio y no a la pantalla: cada área es dueña de su experiencia y de su contrato con el resto, y solo se comparte lo que de verdad es común (sistema de diseño, navegación y utilidades), con versiones explícitas para que una actualización no rompa a quien no está listo.\n\nLo que se gana es autonomía: los equipos no esperan una ventana común para publicar. Lo que cuesta se gestiona de forma activa: dependencias duplicadas que inflan el peso de la página, inconsistencias visuales y rendimiento que ya no es responsabilidad de un solo equipo. Por eso hay presupuestos de rendimiento y reglas de lo que se puede compartir.',
          ['Micro-frontends', 'Contratos entre equipos', 'Sistema de diseño', 'Despliegue independiente']),
        dec('headless-cdn', 'Contenido headless y entrega por CDN',
          'El contenido editorial vive en Contentstack, separado de la presentación, de modo que marketing publica sin esperar un despliegue de código. Delante de todo está Akamai: lo cacheable se sirve desde el borde y al origen solo llega lo necesario.\n\nLa parte difícil es el caché: decidir qué se guarda y por cuánto, invalidar al publicar contenido nuevo, y mantener lo personalizado (sesión, carrito) fuera de lo compartido para no servir a un usuario datos de otro. Next.js permite combinar páginas generadas con regeneración periódica y renderizado en servidor donde la página lo exige.',
          ['Contentstack', 'Akamai CDN', 'Caching', 'Renderizado en servidor']),
        dec('rendimiento', 'Rendimiento guiado por métricas',
          'En un e-commerce el rendimiento se traduce en conversión, así que no se optimiza por intuición. Se miden las métricas que percibe el usuario (Core Web Vitals) con datos reales, se fija un presupuesto por página, y cada cambio relevante se compara contra ese presupuesto. Las mejoras se priorizan por impacto: imágenes, JavaScript innecesario, peticiones en cascada y estrategia de caché.',
          ['Core Web Vitals', 'Presupuestos de rendimiento', 'Optimización de imágenes']),
        dec('dynatrace', 'Observabilidad con Dynatrace',
          'La telemetría de frontend y backend se correlaciona en Dynatrace: la experiencia real del usuario, los tiempos de los servicios y los errores se ven juntos. Durante campañas de alto tráfico permite detectar a tiempo qué área se degrada y decidir con datos si se corrige, se posterga un cambio o se reduce el alcance.',
          ['Dynatrace', 'Observabilidad', 'Monitoreo de usuario real']),
      ],
      business: 'Equilibré las campañas comerciales con la estabilidad técnica: negociamos ventanas de cambio y alcance para no arriesgar fechas clave, y explicamos el costo de cada atajo en términos de riesgo para la campaña.',
      leadership: 'Compartí criterios de calidad, rendimiento y revisión de código con los equipos de las distintas áreas para mantener coherencia sin centralizar las decisiones.',
      practices: ['Spec-Driven Development', 'Presupuestos de rendimiento', 'Revisión de código'],
      results: ['Entregas independientes por área, sin esperar una ventana común.', 'Cambios editoriales sin despliegue de código.', 'Decisiones de rendimiento guiadas por métricas reales en lugar de intuición.'],
    },
  },
  en: {
    description: 'Liverpool.com.mx e-commerce portal: high traffic, with several teams shipping at once. Next.js and React on micro-frontends deployed per area, headless content in Contentstack, delivery through the Akamai CDN and observability with Dynatrace.',
    cs: {
      summary: 'High-traffic e-commerce portal: Next.js on micro-frontends deployed per area, headless content, CDN delivery and performance decisions driven by real metrics.',
      role: 'Full-stack development on the portal: React and Next.js interfaces, backend service integration and performance work alongside each area’s teams.',
      challenge: 'A retail portal with high traffic and campaign-driven peaks, where several teams ship in parallel. Every release had to go out on its own, without breaking the others and without degrading the performance users perceive.',
      decisions: [
        dec('micro-frontends', 'Micro-frontends with clear boundaries',
          'The portal is split by business area, and each is built, tested and deployed separately. Boundaries follow the business, not the screen: each area owns its experience and its contract with the rest, and only what is truly common is shared (design system, navigation and utilities), with explicit versions so an update does not break anyone who is not ready.\n\nWhat is gained is autonomy: teams do not wait for a shared release window. What it costs is managed actively: duplicated dependencies that inflate page weight, visual inconsistencies and performance that is no longer one team’s responsibility. That is why there are performance budgets and rules about what may be shared.',
          ['Micro-frontends', 'Contracts between teams', 'Design system', 'Independent deployment']),
        dec('headless-cdn', 'Headless content and CDN delivery',
          'Editorial content lives in Contentstack, separate from presentation, so marketing publishes without waiting for a code deployment. In front of everything sits Akamai: what is cacheable is served from the edge and only what is needed reaches the origin.\n\nThe hard part is caching: deciding what to keep and for how long, invalidating when new content is published, and keeping personalized data (session, cart) out of shared caches so one user never sees another’s data. Next.js allows combining pages generated with periodic regeneration and server rendering where the page requires it.',
          ['Contentstack', 'Akamai CDN', 'Caching', 'Server rendering']),
        dec('rendimiento', 'Metrics-driven performance',
          'In e-commerce performance translates into conversion, so it is not optimized by gut feeling. The metrics users perceive (Core Web Vitals) are measured with real data, a budget is set per page, and every relevant change is compared against it. Improvements are prioritized by impact: images, unnecessary JavaScript, request waterfalls and caching strategy.',
          ['Core Web Vitals', 'Performance budgets', 'Image optimization']),
        dec('dynatrace', 'Observability with Dynatrace',
          'Frontend and backend telemetry is correlated in Dynatrace: real user experience, service timings and errors are seen together. During high-traffic campaigns it helps detect in time which area is degrading and decide, with data, whether to fix it, postpone a change or reduce scope.',
          ['Dynatrace', 'Observability', 'Real user monitoring']),
      ],
      business: 'I balanced commercial campaigns with technical stability: we negotiated change windows and scope to avoid risking key dates, and explained the cost of each shortcut in terms of risk to the campaign.',
      leadership: 'I shared quality, performance and code review criteria with the teams of the different areas to keep coherence without centralizing decisions.',
      practices: ['Spec-Driven Development', 'Performance budgets', 'Code review'],
      results: ['Independent releases per area, without waiting for a shared window.', 'Editorial changes without a code deployment.', 'Performance decisions driven by real metrics instead of intuition.'],
    },
  },
};

// ───────────────────────── Mi Seguro Liverpool ─────────────────────────
const MISEGURO = {
  es: {
    description: 'Plataforma de seguros de Liverpool (auto, GMM, mascota, PIF y hogar) como SPA en React y Vite, con cotizador en tiempo real, gestión de pólizas y reclamos sobre microservicios en Node.js y PostgreSQL en AWS, y observabilidad con Dynatrace.',
    stack: ['React', 'Vite', 'Node.js', 'PostgreSQL', 'Microservicios', 'AWS', 'Dynatrace', 'Strategy', 'SOLID', 'Blockchain'],
    cs: {
      summary: 'Plataforma de cinco productos de seguro (auto, GMM, mascota, PIF y hogar) con cotizador en tiempo real y gestión de pólizas y reclamos, sobre un dominio modelado para sumar productos sin reescribir los existentes.',
      role: 'Full-stack: SPA en React y servicios backend en Node.js, con el modelado del dominio de cotización como eje.',
      challenge: 'Cinco productos con reglas de cotización distintas debían compartir experiencia, cotizador y gestión de pólizas sin duplicar código, y seguir creciendo cuando negocio sumara otro producto.',
      decisions: [
        dec('dominio-producto', 'Dominio por producto con abstracciones comunes',
          'Modelé cada seguro como una estrategia detrás de una interfaz común de cotización. Lo que es igual en todos (flujo, validaciones comunes, presentación del resultado) vive una sola vez; lo que cambia (reglas, coberturas, cálculo de prima) vive en la estrategia de cada producto. Agregar un seguro es agregar una estrategia, sin tocar las existentes (principio abierto/cerrado).\n\nLas reglas de cotización llegaban a veces ambiguas, así que se aclararon con las áreas de seguros y se fijaron con pruebas por regla: cada caso acordado queda como prueba, y cualquier cambio posterior que lo rompa se nota de inmediato.',
          ['POO', 'SOLID', 'Strategy pattern', 'Pruebas por regla']),
        dec('spa', 'SPA rápida con React y Vite',
          'Una aplicación de una sola página con builds ágiles y componentes reutilizables entre los flujos de cotización: los campos, validaciones y pasos de formulario se comparten, y cada producto solo aporta lo suyo. La carga se divide para que el usuario descargue solo el flujo que usa.',
          ['React', 'Vite', 'Componentes reutilizables', 'Code splitting']),
        dec('servicios', 'Servicios desacoplados sobre Node.js y PostgreSQL',
          'El backend se separa por responsabilidad (cotización, pólizas y reclamos), con Node.js y PostgreSQL en AWS. Cada servicio expone un contrato claro y las operaciones que pueden repetirse, como enviar un reclamo, se diseñan para no duplicarse si el usuario reintenta. Los cambios de esquema pasan por migraciones versionadas.',
          ['Node.js', 'PostgreSQL', 'Microservicios', 'AWS', 'Migraciones versionadas']),
        dec('polizas-reclamos', 'Pólizas y reclamos como flujos con estados auditables',
          'Una póliza y un reclamo avanzan por estados definidos, con transiciones válidas y un historial de quién cambió qué y cuándo. Eso evita estados imposibles, facilita atender dudas del cliente y deja trazabilidad para auditoría.',
          ['Máquina de estados', 'Auditoría', 'Trazabilidad']),
        dec('blockchain-polizas', 'Verificabilidad de pólizas con blockchain',
          'Para que una póliza pueda demostrarse de forma independiente de quien opera la plataforma, se registra en blockchain únicamente su huella criptográfica y metadatos mínimos; el documento y los datos personales se quedan fuera de la cadena. Es el mismo enfoque que se detalla en el caso de PastPost – Legado digital.',
          ['Blockchain', 'Privacidad por diseño', 'Datos fuera de la cadena']),
        dec('observabilidad', 'Observabilidad con Dynatrace',
          'Telemetría de frontend y de servicios para ver el recorrido completo de una cotización: dónde se demora, dónde falla y qué producto se ve afectado. Las mejoras y las correcciones se priorizan con esos datos.',
          ['Dynatrace', 'Observabilidad']),
      ],
      business: 'Con las áreas de seguros fui aclarando reglas de cotización ambiguas y negociando qué entraba en cada entrega, para liberar valor por etapas en lugar de esperar a tener los cinco productos.',
      leadership: 'Documenté el modelo de cotización y el cómo agregar un producto nuevo, para que otras personas del equipo pudieran hacerlo sin depender de mí.',
      practices: ['Strategy', 'SOLID', 'Pruebas por regla', 'Decisiones documentadas (ADR)'],
      results: ['Un cotizador común para varios productos.', 'Alta de nuevos productos sin reescribir los existentes.', 'Reglas de cotización acordadas con negocio y protegidas por pruebas.'],
    },
  },
  en: {
    description: 'Liverpool insurance platform (auto, major medical, pet, PIF and home) as a React and Vite SPA, with real-time quoting, policy and claims management on Node.js and PostgreSQL microservices on AWS, and Dynatrace observability.',
    cs: {
      summary: 'Platform for five insurance products (auto, major medical, pet, PIF and home) with real-time quoting and policy and claims management, on a domain modeled so new products can be added without rewriting existing ones.',
      role: 'Full-stack: React SPA and Node.js backend services, centered on modeling the quoting domain.',
      challenge: 'Five products with different quoting rules had to share experience, quoter and policy management without duplicating code, and keep growing when the business added another product.',
      decisions: [
        dec('dominio-producto', 'Product domain with shared abstractions',
          'I modeled each insurance product as a strategy behind a common quoting interface. What is the same for all (flow, common validations, result presentation) lives once; what changes (rules, coverages, premium calculation) lives in each product’s strategy. Adding an insurance product means adding a strategy, without touching existing ones (open/closed principle).\n\nQuoting rules sometimes arrived ambiguous, so they were clarified with the insurance teams and pinned down with per-rule tests: each agreed case becomes a test, and any later change that breaks it shows immediately.',
          ['OOP', 'SOLID', 'Strategy pattern', 'Per-rule tests']),
        dec('spa', 'Fast SPA with React and Vite',
          'A single-page application with fast builds and components reused across quoting flows: fields, validations and form steps are shared, and each product contributes only its own. Loading is split so users download only the flow they use.',
          ['React', 'Vite', 'Reusable components', 'Code splitting']),
        dec('servicios', 'Decoupled services on Node.js and PostgreSQL',
          'The backend is separated by responsibility (quoting, policies and claims), with Node.js and PostgreSQL on AWS. Each service exposes a clear contract, and operations that can be repeated, such as submitting a claim, are designed not to duplicate if the user retries. Schema changes go through versioned migrations.',
          ['Node.js', 'PostgreSQL', 'Microservices', 'AWS', 'Versioned migrations']),
        dec('polizas-reclamos', 'Policies and claims as flows with auditable states',
          'A policy and a claim move through defined states, with valid transitions and a history of who changed what and when. That prevents impossible states, makes it easier to answer customer questions and leaves traceability for audits.',
          ['State machine', 'Audit', 'Traceability']),
        dec('blockchain-polizas', 'Policy verifiability with blockchain',
          'So a policy can be proven independently of whoever operates the platform, only its cryptographic fingerprint and minimal metadata are recorded on the blockchain; the document and personal data stay off-chain. It is the same approach detailed in the PastPost – Digital Legacy case.',
          ['Blockchain', 'Privacy by design', 'Off-chain data']),
        dec('observabilidad', 'Observability with Dynatrace',
          'Frontend and service telemetry to see the full path of a quote: where it slows down, where it fails and which product is affected. Improvements and fixes are prioritized with that data.',
          ['Dynatrace', 'Observability']),
      ],
      business: 'With the insurance teams I clarified ambiguous quoting rules and negotiated what went into each release, to deliver value in stages instead of waiting for all five products.',
      leadership: 'I documented the quoting model and how to add a new product, so others on the team could do it without depending on me.',
      practices: ['Strategy', 'SOLID', 'Per-rule tests', 'Documented decisions (ADR)'],
      results: ['A common quoter for several products.', 'New products added without rewriting existing ones.', 'Quoting rules agreed with the business and protected by tests.'],
    },
  },
};

// ───────────────────────── Suburbia ─────────────────────────
const SUBURBIA = {
  es: {
    description: 'Portal de seguros de Suburbia para clientes y agentes, con directorio de agentes, cotizador y contratación. Next.js con Material UI, autenticación con Auth0 y roles, backend en Node.js con PostgreSQL y entrega con GitLab CI/CD.',
    stack: ['Next.js', 'React', 'Material UI', 'Auth0', 'OIDC', 'JWT', 'Node.js', 'PostgreSQL', 'GitLab CI/CD', 'Adapter'],
    cs: {
      summary: 'Portal único para clientes y agentes de Suburbia, con directorio de agentes, cotizador y contratación, acceso controlado por roles e integración con sistemas existentes.',
      role: 'Full-stack: frontend en Next.js y backend en Node.js, con foco en identidad, integración con sistemas heredados y entrega continua.',
      challenge: 'Dar a clientes y agentes un solo portal que se integrara con sistemas ya existentes y protegiera el acceso a datos personales, entregándolo por módulos para liberar valor pronto.',
      decisions: [
        dec('auth0', 'Identidad delegada a Auth0',
          'En lugar de reimplementar una pieza sensible, la identidad se delega en Auth0 (OAuth2/OIDC). El portal recibe tokens JWT y el backend los valida en cada llamada, verificando emisor, audiencia y vigencia. Los roles (cliente y agente) se traducen a permisos de mínimo privilegio, de modo que cada persona ve solo lo que le corresponde.\n\nSe gana seguridad probada, recuperación de cuenta y soporte de estándares sin mantenerlos. A cambio hay una dependencia de un tercero, que se acota usando solo protocolos estándar para poder cambiar de proveedor sin reescribir el portal.',
          ['Auth0', 'OAuth2/OIDC', 'JWT', 'Mínimo privilegio', 'Roles']),
        dec('nextjs-mui', 'Next.js con Material UI',
          'Renderizado en servidor para la velocidad inicial y el posicionamiento del directorio de agentes, con componentes consistentes y accesibles de Material UI. Un tema compartido mantiene la identidad visual coherente entre los módulos.',
          ['Next.js', 'Material UI', 'SSR', 'Accesibilidad']),
        dec('integracion', 'Integración con sistemas existentes',
          'Los sistemas heredados se aíslan detrás de capas de adaptación: la lógica del portal habla con una interfaz propia y el adaptador traduce hacia cada sistema. Así sus formatos y peculiaridades no se filtran al resto del código. Las llamadas externas llevan tiempos de espera y reintentos acotados para que la lentitud de un sistema no deje al portal colgado.',
          ['Adapter pattern', 'Node.js', 'PostgreSQL', 'Tolerancia a fallas']),
        dec('entrega', 'Entrega continua con GitLab CI/CD',
          'El pipeline ejecuta pruebas y verificaciones en cada cambio y despliega de forma repetible, de modo que liberar un módulo no depende de pasos manuales ni de la memoria de quien lo hace.',
          ['GitLab CI/CD', 'Integración continua', 'Despliegues repetibles']),
      ],
      business: 'Alineé con negocio el orden de los módulos (directorio, cotizador y contratación) para liberar primero lo que más valor aportaba y aprender con uso real antes de construir lo siguiente.',
      leadership: 'Acordé convenciones de código y de entrega con el equipo, y documenté las decisiones de identidad e integración para que se sostuvieran cuando el equipo cambiara.',
      practices: ['Adapter', 'Mínimo privilegio', 'Integración y entrega continuas', 'Decisiones documentadas (ADR)'],
      results: ['Un portal único para clientes y agentes.', 'Acceso controlado por roles con identidad delegada.', 'Sistemas heredados aislados detrás de adaptadores, sin contaminar el código del portal.'],
    },
  },
  en: {
    description: 'Suburbia insurance portal for customers and agents, with agent directory, quoter and contracting. Next.js with Material UI, Auth0 authentication with roles, a Node.js backend with PostgreSQL and delivery through GitLab CI/CD.',
    cs: {
      summary: 'A single portal for Suburbia customers and agents, with agent directory, quoter and contracting, role-based access and integration with existing systems.',
      role: 'Full-stack: Next.js frontend and Node.js backend, focused on identity, legacy-system integration and continuous delivery.',
      challenge: 'Give customers and agents a single portal that integrated with existing systems and protected access to personal data, delivered module by module to release value early.',
      decisions: [
        dec('auth0', 'Identity delegated to Auth0',
          'Instead of reimplementing a sensitive piece, identity is delegated to Auth0 (OAuth2/OIDC). The portal receives JWT tokens and the backend validates them on every call, checking issuer, audience and expiry. Roles (customer and agent) map to least-privilege permissions, so each person sees only what applies to them.\n\nThis brings proven security, account recovery and standards support without maintaining them. The cost is a third-party dependency, bounded by using only standard protocols so the provider can be swapped without rewriting the portal.',
          ['Auth0', 'OAuth2/OIDC', 'JWT', 'Least privilege', 'Roles']),
        dec('nextjs-mui', 'Next.js with Material UI',
          'Server rendering for initial speed and agent-directory discoverability, with consistent, accessible Material UI components. A shared theme keeps the visual identity coherent across modules.',
          ['Next.js', 'Material UI', 'SSR', 'Accessibility']),
        dec('integracion', 'Integration with existing systems',
          'Legacy systems are isolated behind adaptation layers: portal logic talks to its own interface and the adapter translates to each system. That keeps their formats and quirks from leaking into the rest of the code. External calls carry bounded timeouts and retries so one slow system does not leave the portal hanging.',
          ['Adapter pattern', 'Node.js', 'PostgreSQL', 'Fault tolerance']),
        dec('entrega', 'Continuous delivery with GitLab CI/CD',
          'The pipeline runs tests and checks on every change and deploys repeatably, so releasing a module does not depend on manual steps or on the memory of whoever does it.',
          ['GitLab CI/CD', 'Continuous integration', 'Repeatable deployments']),
      ],
      business: 'I aligned the module order (directory, quoter and contracting) with the business so the most valuable part shipped first and we learned from real use before building the next.',
      leadership: 'I agreed code and delivery conventions with the team, and documented the identity and integration decisions so they would hold when the team changed.',
      practices: ['Adapter', 'Least privilege', 'Continuous integration and delivery', 'Documented decisions (ADR)'],
      results: ['A single portal for customers and agents.', 'Role-based access with delegated identity.', 'Legacy systems isolated behind adapters, without contaminating the portal code.'],
    },
  },
};

const TARGETS = { 'liverpool-ecommerce': ECOM, 'liverpool-seguros': MISEGURO, 'suburbia-seguros': SUBURBIA };

// Herramientas de Capacidades que se enlazan a casos cuyo contenido ya las respalda (nombres en ES; EN por posición).
const CHIP_LINKS = {
  'pastpost-social-network': ['OIDC', 'JWT', 'IAM', 'Gestión de secretos', 'SAST', 'TLS', 'OpenZeppelin', 'LangChain', 'Embeddings', 'Guardrails', 'Evals', 'FinOps', 'Grafana', 'DataDog'],
  'pastpost-mobile': ['OIDC', 'JWT'],
  'suburbia-seguros': ['OIDC', 'JWT'],
};

// Frases del caso web que deben mencionar explícitamente lo que se enlaza (SAST y TLS).
const TEXT_FIXES = {
  es: [
    ['El tráfico va cifrado en tránsito;', 'El tráfico va cifrado en tránsito con TLS;'],
    ['los controles corren en el pipeline (análisis estático y de dependencias)', 'los controles corren en el pipeline (análisis estático SAST y de dependencias)'],
  ],
  en: [
    ['Traffic is encrypted in transit;', 'Traffic is encrypted in transit with TLS;'],
    ['controls run in the pipeline (static and dependency analysis)', 'controls run in the pipeline (static analysis (SAST) and dependency analysis)'],
  ],
};

(async () => {
  const root = path.join(__dirname, '..', '..', 'frontend', 'messages');
  const msgs = { es: JSON.parse(fs.readFileSync(path.join(root, 'es.json'), 'utf8')), en: JSON.parse(fs.readFileSync(path.join(root, 'en.json'), 'utf8')) };
  const enName = {};
  msgs.es.capabilities.items.forEach((it, i) => it.tools.forEach((t, j) => { enName[t] = msgs.en.capabilities.items[i].tools[j]; }));

  const slugs = [...Object.keys(TARGETS), ...Object.keys(CHIP_LINKS)];
  const docs = await client.fetch('*[_type=="project" && slug.current in $slugs]{_id, language, "slug": slug.current, stack, caseStudy}', { slugs });
  for (const d of docs) {
    const lang = d.language === 'en' ? 'en' : 'es';
    const set = {};
    const target = TARGETS[d.slug];
    let stack = d.stack || [];
    if (target) {
      const c = target[lang];
      set.description = c.description;
      set.caseStudy = { ...c.cs };
      const add = (target.es.stack || []).filter((s) => lang !== 'en' || s !== 'Microservicios');
      stack = [...new Set([...add, ...stack])];
    }
    const links = (CHIP_LINKS[d.slug] || []).map((t) => (lang === 'en' ? enName[t] || t : t));
    stack = [...new Set([...stack, ...links])];
    set.stack = stack;
    if (d.slug === 'pastpost-social-network') {
      const cs = JSON.parse(JSON.stringify(d.caseStudy));
      for (const dd of cs.decisions) for (const [from, to] of TEXT_FIXES[lang]) dd.body = (dd.body || '').replace(from, to);
      set.caseStudy = cs;
    }
    await client.patch(d._id).set(set).commit();
    console.log('updated', d.slug, lang, `(${stack.length} tools)`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
