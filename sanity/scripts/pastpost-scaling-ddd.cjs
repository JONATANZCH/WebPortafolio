/**
 * Añade a los casos de PastPost (web y móvil) la migración por dominio a NestJS con DDD
 * y la estrategia de cómputo (Fargate para lo siempre disponible, Kubernetes para el resto).
 * BORRADOR basado en lo descrito por el autor: validar alcance, dominios y plataforma (p. ej. EKS).
 * Idempotente. Uso: node scripts/pastpost-scaling-ddd.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

const dec = (key, title, body, principles) => ({ _key: key, _type: 'decision', title, body, principles });

const WEB = {
  es: {
    after: 'eventos-aws',
    decisions: [
      dec('migracion-ddd', 'Escalar migrando por dominio a servicios NestJS con DDD',
        'Cuando algunos servicios empezaron a escalar, en lugar de reescribirlos de golpe los migramos por dominio: primero usuarios, luego productos, pagos y así sucesivamente, cada uno hacia su propio servicio en NestJS. Los límites no salieron de los endpoints sino de Domain-Driven Design: un lenguaje ubicuo con negocio, contextos acotados, agregados que protegen sus reglas y puertos y adaptadores (arquitectura hexagonal) para que el dominio no dependa de la infraestructura.\n\nLa migración sigue el patrón strangler: un dominio a la vez, con el tráfico redirigido gradualmente desde API Gateway al servicio nuevo y con la capacidad de volver atrás si algo falla. Mientras convive lo viejo con lo nuevo, una capa anticorrupción traduce entre modelos para que el diseño nuevo no herede los defectos del anterior. Cada servicio es dueño de sus datos; no se comparten tablas entre dominios, y la información que otros necesitan viaja por eventos publicados con outbox. Las pruebas de contrato y las pruebas de dominio, que no necesitan infraestructura levantada, dan la red de seguridad.\n\nSe empieza por dominios con límites claros y alto valor de escala, y los más acoplados o críticos como pagos se mueven después, con más cuidado. A cambio hay costos reales: la migración de datos, más piezas que operar, transacciones que pasan a ser sagas y consistencia eventual entre dominios. Por eso solo se separa lo que lo justifica; el resto puede quedarse en un módulo del mismo servicio hasta que haga falta.',
        ['Domain-Driven Design', 'Bounded contexts', 'Strangler Fig', 'Arquitectura hexagonal', 'NestJS', 'Capa anticorrupción']),
      dec('computo-fargate-k8s', 'Dónde corre cada servicio: Fargate, Kubernetes y Lambda',
        'Elegimos la plataforma según el comportamiento de cada carga. Lo que debe estar siempre disponible y con tráfico constante, como los servicios de dominio migrados a NestJS, corre en ECS Fargate: no hay nodos que administrar, el escalado es automático por métricas, los despliegues son graduales con verificación de salud y reversión, y detrás hay un balanceador con varias instancias en distintas zonas de disponibilidad. Los demás microservicios corren en Kubernetes, donde necesitamos más control: espacios de nombres por equipo o dominio, límites de recursos, escalado horizontal, sondas de salud, políticas de red y despliegues declarativos. Lambda se reserva para lo corto, esporádico o dirigido por eventos.\n\nLa contrapartida es operar dos plataformas de contenedores, lo cual exige estandarizar: la misma imagen base mínima, el mismo pipeline con análisis de imágenes y dependencias, la misma observabilidad y la misma convención de configuración y secretos. La regla es elegir por la carga y no por moda; si una plataforma no aporta algo concreto, no se suma.',
        ['ECS Fargate', 'Kubernetes', 'AWS Lambda', 'Docker', 'Autoescalado', 'Despliegues graduales']),
    ],
    results: ['Servicios de dominio separados que escalan por su cuenta, migrados sin una reescritura total ni cortes para el usuario.'],
    practices: ['Domain-Driven Design', 'Strangler Fig'],
    stack: ['Kubernetes', 'DDD', 'Hexagonal'],
  },
  en: {
    after: 'eventos-aws',
    decisions: [
      dec('migracion-ddd', 'Scaling by migrating domain by domain to NestJS services with DDD',
        'When some services started to scale, instead of rewriting them all at once we migrated them by domain: users first, then products, payments and so on, each into its own NestJS service. The boundaries did not come from the endpoints but from Domain-Driven Design: a ubiquitous language with the business, bounded contexts, aggregates that protect their rules and ports and adapters (hexagonal architecture) so the domain does not depend on infrastructure.\n\nThe migration follows the strangler pattern: one domain at a time, with traffic shifted gradually from API Gateway to the new service and the ability to roll back if something fails. While old and new coexist, an anti-corruption layer translates between models so the new design does not inherit the old one’s flaws. Each service owns its data; no tables are shared across domains, and information others need travels as events published with the outbox. Contract tests and domain tests, which need no infrastructure, provide the safety net.\n\nWe start with domains that have clear boundaries and high scaling value, and move the most coupled or critical ones, like payments, later and more carefully. The costs are real: data migration, more pieces to operate, transactions that become sagas and eventual consistency between domains. That is why only what justifies it is split out; the rest can stay as a module inside the same service until it is needed.',
        ['Domain-Driven Design', 'Bounded contexts', 'Strangler Fig', 'Hexagonal architecture', 'NestJS', 'Anti-corruption layer']),
      dec('computo-fargate-k8s', 'Where each service runs: Fargate, Kubernetes and Lambda',
        'We choose the platform by how each workload behaves. What must be always available with steady traffic, like the domain services migrated to NestJS, runs on ECS Fargate: no nodes to manage, automatic metric-based scaling, gradual deployments with health checks and rollback, and a load balancer in front of several instances across availability zones. The remaining microservices run on Kubernetes, where we need more control: namespaces per team or domain, resource limits, horizontal scaling, health probes, network policies and declarative deployments. Lambda is kept for short, sporadic or event-driven work.\n\nThe trade-off is operating two container platforms, which demands standardization: the same minimal base image, the same pipeline with image and dependency scanning, the same observability and the same configuration and secrets convention. The rule is to choose by workload, not fashion; if a platform adds nothing concrete, it is not added.',
        ['ECS Fargate', 'Kubernetes', 'AWS Lambda', 'Docker', 'Autoscaling', 'Gradual deployments']),
    ],
    results: ['Separate domain services that scale on their own, migrated without a full rewrite or user-facing downtime.'],
    practices: ['Domain-Driven Design', 'Strangler Fig'],
    stack: ['Kubernetes', 'DDD', 'Hexagonal'],
  },
};

const MOBILE = {
  es: {
    after: 'backend-compartido',
    decisions: [
      dec('escalado-dominios', 'Escalado por dominio sin que la app lo note',
        'Los servicios que se migran a NestJS con DDD, por dominio y sobre Fargate o Kubernetes, se reemplazan detrás del mismo API Gateway. Como la app depende de contratos versionados y no de dónde corre cada servicio, un dominio puede cambiar de implementación con tráfico gradual y reversión, sin publicar una versión nueva en las tiendas. El detalle de la migración y de la plataforma está en el caso de PastPost – Legado digital.',
        ['Strangler Fig', 'Domain-Driven Design', 'Kubernetes', 'ECS Fargate']),
    ],
    stack: ['Kubernetes', 'DDD'],
  },
  en: {
    after: 'backend-compartido',
    decisions: [
      dec('escalado-dominios', 'Scaling by domain without the app noticing',
        'Services migrated to NestJS with DDD, domain by domain and onto Fargate or Kubernetes, are replaced behind the same API Gateway. Because the app depends on versioned contracts and not on where each service runs, a domain can change implementation with gradual traffic and rollback, without publishing a new version to the stores. The migration and platform details are in the PastPost – Digital Legacy case.',
        ['Strangler Fig', 'Domain-Driven Design', 'Kubernetes', 'ECS Fargate']),
    ],
    stack: ['Kubernetes', 'DDD'],
  },
};

const TARGETS = [
  { slug: 'pastpost-social-network', data: WEB },
  { slug: 'pastpost-mobile', data: MOBILE },
];

(async () => {
  const docs = await client.fetch('*[_type=="project" && slug.current in $slugs]{_id, language, "slug": slug.current, stack, caseStudy}', { slugs: TARGETS.map((t) => t.slug) });
  for (const d of docs) {
    const lang = d.language === 'en' ? 'en' : 'es';
    const add = TARGETS.find((t) => t.slug === d.slug).data[lang];
    const keys = new Set(add.decisions.map((x) => x._key));
    const current = (d.caseStudy.decisions || []).filter((x) => !keys.has(x._key));
    const at = current.findIndex((x) => x._key === add.after);
    const decisions = at === -1 ? [...current, ...add.decisions] : [...current.slice(0, at + 1), ...add.decisions, ...current.slice(at + 1)];
    const uniq = (a, b) => [...new Set([...(a || []), ...(b || [])])];
    const caseStudy = {
      ...d.caseStudy,
      decisions,
      practices: uniq(d.caseStudy.practices, add.practices),
      results: uniq(d.caseStudy.results, add.results),
    };
    await client.patch(d._id).set({ stack: uniq(d.stack, add.stack), caseStudy }).commit();
    console.log('updated', d.slug, lang, `(${decisions.length} decisions)`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
