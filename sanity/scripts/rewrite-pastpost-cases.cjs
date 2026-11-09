/**
 * Reescribe los dos casos de PastPost (web y móvil) con arquitectura, terceros, pagos y seguridad.
 * BORRADOR basado en lo que describió el autor: valida cifras, alcance y roles antes de dejarlo público.
 * Uso: node scripts/rewrite-pastpost-cases.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

const dec = (key, title, body, principles) => ({ _key: key, _type: 'decision', title, body, principles });

// ─────────────────────────────── WEB (Legado digital) ───────────────────────────────
const WEB = {
  es: {
    title: 'PastPost – Legado digital',
    description:
      'Plataforma web para planificar asuntos finales y dejar un legado digital. Next.js con Auth0 sobre un backend serverless orientado a eventos en AWS, firma digital con constancia NOM-151 de un tercero, y pagos con Stripe y una pasarela propia.',
    stack: ['Next.js', 'React', 'TypeScript', 'Auth0', 'NestJS', 'Python', 'AWS', 'AWS Lambda', 'API Gateway', 'SQS/SNS', 'EventBridge', 'Step Functions', 'ECS Fargate', 'EC2', 'Kafka', 'RabbitMQ', 'CloudWatch', 'KMS', 'Secrets Manager', 'Terraform', 'Docker', 'Stripe', 'Seguridata', 'NOM-151', 'RAG', 'Ethereum', 'Solidity', 'Blockchain', 'EVM', 'Smart contracts', 'ADR', 'Roadmaps técnicos', 'Code review', 'Mentoría', 'Documentación'],
    caseStudy: {
      summary:
        'Plataforma web de legado digital: Next.js con Auth0 sobre un backend serverless y orientado a eventos en AWS, con firma digital y constancia NOM-151 de un tercero, y una pasarela de pagos propia que convive con Stripe.',
      role: 'Backend Developer / Cloud & DevOps: arquitectura de servicios en AWS, integración de terceros (firma digital y pagos), infraestructura como código, seguridad y observabilidad.',
      challenge:
        'Un producto que custodia documentos y voluntades con validez legal y además cobra suscripciones y servicios. Cada documento debía tener identidad, integridad y valor probatorio; el dinero debía moverse sin errores ni duplicados; y el backend tenía que crecer sin reescribirse cada vez que cambiara un proveedor.',
      decisions: [
        dec('eventos-aws', 'Arquitectura orientada a eventos y serverless en AWS',
          'El backend son servicios pequeños que se comunican por eventos. Lo corto y bajo demanda corre en Lambda detrás de API Gateway; lo largo, con estado o con dependencias pesadas va en contenedores (ECS Fargate) o, donde conviene, en EC2. La mensajería combina SQS para colas con reintentos y colas de mensajes fallidos, SNS para repartir eventos y EventBridge para enrutarlos entre dominios; Kafka y RabbitMQ se usan donde hace falta retención de eventos o enrutamiento avanzado. Step Functions orquesta los flujos de varios pasos (firma, cobro, notificación) con compensaciones.\n\nElegimos eventos porque desacoplan los dominios, absorben picos y evitan que la falla de un tercero bloquee al usuario. A cambio hay consistencia eventual y más trabajo de observabilidad, que se cubre con idempotencia en cada consumidor y un identificador de correlación en todo el recorrido.',
          ['AWS Lambda', 'API Gateway', 'Amazon SQS', 'Amazon SNS', 'EventBridge', 'Step Functions', 'ECS Fargate', 'Kafka', 'RabbitMQ']),
        dec('identidad', 'Identidad: Auth0 en la web, Cognito en móvil, un solo contrato en la API',
          'La web autentica con Auth0 y la app móvil con Amazon Cognito. Ambos emiten JWT que la API valida en una única capa (authorizer), así que los servicios reciben una identidad y unos permisos normalizados sin saber qué proveedor los emitió. Evita duplicar la autorización y permite cambiar o sumar proveedores sin tocar el dominio. Aplico mínimo privilegio, tokens de vida corta con renovación y validación de emisor y audiencia en cada llamada.',
          ['Auth0', 'Amazon Cognito', 'OAuth2/OIDC', 'JWT']),
        dec('firma-nom151', 'Firma digital y constancia NOM-151 con Seguridata',
          'Para que un documento tenga valor legal en México, su firma y su conservación deben cumplir la NOM-151. Esa capa se delega en Seguridata, un tercero especializado, en lugar de construirla. El flujo calcula la huella del documento, la envía a Seguridata para firmarla y obtener la constancia de conservación, y asocia esa evidencia al documento. Es asíncrono: una cola desacopla la solicitud, reintenta con espera creciente ante fallas del proveedor y deja los casos agotados en una cola de revisión.\n\nEligimos un tercero porque el valor probatorio depende de quién certifica, no de que el código funcione, y porque operar esa certificación por cuenta propia no aporta ventaja al negocio. El costo es depender de su disponibilidad y de su contrato de servicio, por eso se aísla detrás de una interfaz propia y se monitorea.',
          ['Seguridata', 'NOM-151', 'Firma digital', 'Adapter']),
        dec('pagos-por-que', 'Pagos: una pasarela propia junto a Stripe',
          'Algunos flujos cobran con Stripe y otros con una pasarela interna, construida desde cero, que se integra directamente con los bancos. Ambas viven detrás de una misma interfaz de pagos (un puerto con un adaptador por proveedor), de modo que el resto del sistema no distingue entre ellas.\n\nDecidimos construir la propia por economía y control. Con volumen alto, la comisión por transacción de un procesador externo pesa más que el costo de operar una integración directa; además permite controlar los tiempos de liquidación, la conciliación y los datos. Stripe se mantiene donde su cobertura y su experiencia de pago justifican la comisión.',
          ['Stripe', 'Pasarela de pagos propia', 'Strategy', 'Adapter']),
        dec('pagos-arquitectura', 'Arquitectura de la pasarela: libro contable, estados y conciliación',
          'El núcleo es un libro contable de doble entrada: cada movimiento genera asientos que suman cero y el saldo siempre se deriva de ellos, nunca se edita. Cada pago es una máquina de estados explícita (creado, autorizado, liquidado, fallido, reembolsado) con transiciones validadas y una bitácora de auditoría. Cada operación lleva una clave de idempotencia para que un reintento no cobre dos veces, y los eventos se publican con el patrón outbox, en la misma transacción que el dato, para no perderlos ni duplicarlos.\n\nLa conciliación compara lo que registró el sistema, lo que informó el banco y el extracto contable; las diferencias abren casos de revisión en lugar de corregirse en silencio. Descontar transacciones, comisiones y reembolsos se hace con asientos, no actualizando saldos.\n\nLa confiabilidad se apoya en mecanismos y no en promesas: idempotencia, bitácora, conciliación periódica, colas con reintentos, alarmas y pruebas explícitas de los flujos de falla (banco caído, webhook duplicado, eventos en orden invertido).',
          ['Libro contable', 'Idempotencia', 'Outbox', 'Saga', 'Conciliación bancaria']),
        dec('webhooks', 'Webhooks confiables, entrantes y salientes',
          'Los bancos y proveedores avisan por webhooks, y la plataforma emite los suyos. En los entrantes verifico la firma (HMAC) y la marca de tiempo para evitar suplantación y repeticiones, respondo rápido con 2xx y proceso en segundo plano desde una cola. Los eventos pueden llegar duplicados o fuera de orden, así que cada consumidor es idempotente y valida el estado actual antes de aplicar una transición. En los salientes hay firma, reintentos con espera creciente, contrato versionado y una cola de mensajes fallidos con alertas.',
          ['Webhooks', 'HMAC', 'Idempotencia', 'DLQ']),
        dec('seguridad-pagos', 'Seguridad de las transacciones',
          'Los datos sensibles de pago no se guardan salvo que sea indispensable: se tokenizan y, cuando hay que conservarlos, van cifrados con claves en AWS KMS y secretos en Secrets Manager, con rotación. El tráfico va cifrado en tránsito; CloudFront y WAF filtran el borde, y los servicios corren con roles IAM de mínimo privilegio y separación de funciones. Cada operación es auditable (quién, qué y cuándo) y hay alertas para volumen anómalo, reintentos y fallas de conciliación. El diseño se revisa con modelado de amenazas y los controles corren en el pipeline (análisis estático y de dependencias). Cuando entran datos de tarjeta, el alcance de PCI DSS define qué parte puede tocar la plataforma.',
          ['AWS KMS', 'Secrets Manager', 'IAM', 'WAF', 'Modelado de amenazas', 'PCI DSS']),
        dec('pros-contras', 'Ventajas y desventajas de construir una pasarela propia',
          'Ventajas: se evitan comisiones por transacción, se controla el ciclo del dinero (liquidación, conciliación, reembolsos), los datos son propios y se diseñan flujos que un proveedor genérico no ofrece.\n\nDesventajas: se asume la responsabilidad regulatoria y de cumplimiento, el fraude y los contracargos, la operación continua y la fragilidad de integrar bancos (formatos, ventanas, caídas). Hay costo de oportunidad y un equipo que sostener.\n\nPor eso la decisión solo se justifica con volumen y acceso bancario suficientes, y por eso conservamos Stripe donde la comisión compensa la comodidad. Si lo repitiera, empezaría con un proveedor y construiría la pasarela cuando los números lo pidieran.',
          ['Trade-offs', 'FinOps', 'Cumplimiento']),
        dec('retos', 'Retos técnicos más importantes',
          '1. Consistencia entre sistemas: un pago involucra al banco, el libro contable y la firma; se resolvió con sagas y compensaciones en lugar de transacciones distribuidas.\n\n2. Duplicados y orden de eventos: la entrega es al menos una vez (SQS y SNS), así que se resolvió con idempotencia y máquinas de estado.\n\n3. Conciliación con bancos: formatos y tiempos distintos; se normalizan y las excepciones pasan a revisión.\n\n4. Dependencia de terceros: Seguridata y los bancos fallan; se aíslan con interfaces propias, reintentos y degradación controlada.\n\n5. Evolución de contratos: webhooks y API versionados para no romper a quien los consume.',
          ['Sagas', 'Consistencia eventual', 'Resiliencia']),
        dec('rag', 'RAG con guardrails y evaluaciones',
          'Pipeline de embeddings y búsqueda semántica en una base vectorial para responder con contexto propio, con guardrails de entrada y salida y evaluaciones para detectar respuestas fuera de alcance antes de que lleguen al usuario.',
          ['RAG', 'LangChain', 'Embeddings', 'Bases vectoriales']),
        dec('infra', 'Infraestructura reproducible, entregas seguras y observabilidad',
          'Toda la infraestructura se define como código con Terraform y se despliega con pipelines CI/CD que ejecutan análisis estático y de dependencias y bloquean el paso a producción ante vulnerabilidades. La observabilidad se apoya en CloudWatch (métricas, registros y alarmas) y paneles en Grafana o DataDog; las colas de mensajes fallidos y la conciliación tienen alertas propias para enterarse antes que el usuario.',
          ['Terraform', 'CloudWatch', 'CI/CD', 'Grafana', 'DataDog']),
      ],
      business:
        'Junto con negocio y legal acordamos qué debía tener validez legal (firma y NOM-151) y qué podía resolverse con tecnología propia. Convertimos las comisiones y el riesgo regulatorio en opciones comparables para justificar la pasarela propia, y pactamos el orden de entrega por etapas.',
      leadership:
        'Documenté las decisiones como ADR (por qué un tercero para la firma, por qué una pasarela propia, por qué Ethereum), definí los contratos de eventos y webhooks con quienes los consumen y dejé revisiones de código y guías de operación (runbooks) para las fallas de terceros.',
      practices: ['Arquitectura orientada a eventos', 'Arquitectura hexagonal', 'Domain-Driven Design', 'Spec-Driven Development', 'Test-Driven Development', 'Integración y entrega continuas', 'Decisiones documentadas (ADR)', 'Modelado de amenazas', 'Outbox', 'Saga', 'Idempotencia'],
      results: [
        'Flujos de firma y de pago desacoplados que toleran fallas de terceros sin perder operaciones.',
        'Cobros sin duplicados gracias a la idempotencia y la conciliación contra el banco.',
        'Una misma interfaz de pagos que permite usar Stripe o la pasarela propia según el flujo.',
        'Evidencia con valor legal conservada por documento (firma y constancia NOM-151).',
      ],
    },
  },
  en: {
    title: 'PastPost – Digital Legacy',
    description:
      'Web platform to plan final affairs and leave a digital legacy. Next.js with Auth0 on a serverless, event-driven AWS backend, digital signatures with a third-party NOM-151 certificate, and payments through Stripe and an in-house gateway.',
    stack: null, // same as ES (tool names are shared)
    caseStudy: {
      summary:
        'Digital legacy web platform: Next.js with Auth0 on a serverless, event-driven AWS backend, with third-party digital signatures and NOM-151 certification, and an in-house payment gateway that coexists with Stripe.',
      role: 'Backend Developer / Cloud & DevOps: AWS service architecture, third-party integration (digital signatures and payments), infrastructure as code, security and observability.',
      challenge:
        'A product that safeguards documents and wishes with legal validity and also charges for subscriptions and services. Every document needed identity, integrity and evidentiary value; money had to move without errors or duplicates; and the backend had to grow without being rewritten each time a provider changed.',
      decisions: [
        dec('eventos-aws', 'Event-driven, serverless architecture on AWS',
          'The backend is a set of small services that communicate through events. Short, on-demand work runs on Lambda behind API Gateway; long-running, stateful or heavy-dependency work goes into containers (ECS Fargate) or, where it fits, EC2. Messaging combines SQS for queues with retries and dead-letter queues, SNS for fan-out and EventBridge for routing events between domains; Kafka and RabbitMQ are used where event retention or advanced routing is needed. Step Functions orchestrates multi-step flows (signing, charging, notifying) with compensations.\n\nWe chose events because they decouple domains, absorb spikes and keep a third-party failure from blocking the user. The price is eventual consistency and more observability work, covered by idempotency in every consumer and a correlation id across the whole path.',
          ['AWS Lambda', 'API Gateway', 'Amazon SQS', 'Amazon SNS', 'EventBridge', 'Step Functions', 'ECS Fargate', 'Kafka', 'RabbitMQ']),
        dec('identidad', 'Identity: Auth0 on web, Cognito on mobile, one API contract',
          'The web authenticates with Auth0 and the mobile app with Amazon Cognito. Both issue JWTs that the API validates in a single layer (authorizer), so services receive a normalized identity and permissions without knowing which provider issued them. It avoids duplicating authorization and lets us swap or add providers without touching the domain. I apply least privilege, short-lived tokens with renewal and issuer and audience validation on every call.',
          ['Auth0', 'Amazon Cognito', 'OAuth2/OIDC', 'JWT']),
        dec('firma-nom151', 'Digital signature and NOM-151 certification with Seguridata',
          'For a document to have legal value in Mexico, its signature and preservation must comply with NOM-151. That layer is delegated to Seguridata, a specialized third party, instead of building it. The flow computes the document fingerprint, sends it to Seguridata to be signed and to obtain the preservation certificate, and attaches that evidence to the document. It is asynchronous: a queue decouples the request, retries with growing backoff when the provider fails and leaves exhausted cases in a review queue.\n\nWe chose a third party because evidentiary value depends on who certifies, not on the code working, and because running that certification ourselves gives the business no advantage. The cost is depending on their availability and service contract, so it is isolated behind our own interface and monitored.',
          ['Seguridata', 'NOM-151', 'Digital signature', 'Adapter']),
        dec('pagos-por-que', 'Payments: an in-house gateway next to Stripe',
          'Some flows charge through Stripe and others through an internal gateway, built from scratch, that integrates directly with the banks. Both live behind the same payments interface (a port with one adapter per provider), so the rest of the system cannot tell them apart.\n\nWe decided to build our own for economics and control. At high volume, an external processor’s per-transaction fee outweighs the cost of running a direct integration; it also gives control over settlement times, reconciliation and data. Stripe stays where its coverage and payment experience justify the fee.',
          ['Stripe', 'In-house payment gateway', 'Strategy', 'Adapter']),
        dec('pagos-arquitectura', 'Gateway architecture: ledger, states and reconciliation',
          'The core is a double-entry ledger: every movement produces entries that sum to zero, and a balance is always derived from them, never edited. Each payment is an explicit state machine (created, authorized, settled, failed, refunded) with validated transitions and an audit log. Every operation carries an idempotency key so a retry cannot charge twice, and events are published with the outbox pattern, in the same transaction as the data, so they are neither lost nor duplicated.\n\nReconciliation compares what the system recorded, what the bank reported and the accounting statement; differences open review cases instead of being fixed silently. Deducting transactions, fees and refunds is done with ledger entries, not by updating balances.\n\nReliability rests on mechanisms, not promises: idempotency, an audit log, periodic reconciliation, queues with retries, alarms and explicit tests of failure flows (bank down, duplicate webhook, events out of order).',
          ['Ledger', 'Idempotency', 'Outbox', 'Saga', 'Bank reconciliation']),
        dec('webhooks', 'Reliable webhooks, inbound and outbound',
          'Banks and providers notify us through webhooks, and the platform emits its own. For inbound ones I verify the signature (HMAC) and timestamp to prevent spoofing and replays, answer fast with 2xx and process in the background from a queue. Events can arrive duplicated or out of order, so every consumer is idempotent and checks the current state before applying a transition. Outbound webhooks have signing, retries with growing backoff, a versioned contract and a dead-letter queue with alerts.',
          ['Webhooks', 'HMAC', 'Idempotency', 'DLQ']),
        dec('seguridad-pagos', 'Transaction security',
          'Sensitive payment data is not stored unless indispensable: it is tokenized and, when it must be kept, encrypted with keys in AWS KMS and secrets in Secrets Manager, with rotation. Traffic is encrypted in transit; CloudFront and WAF filter the edge, and services run with least-privilege IAM roles and separation of duties. Every operation is auditable (who, what and when) and there are alerts for anomalous volume, retries and reconciliation failures. The design is reviewed with threat modeling and controls run in the pipeline (static and dependency analysis). When card data is involved, the PCI DSS scope defines which part the platform may touch.',
          ['AWS KMS', 'Secrets Manager', 'IAM', 'WAF', 'Threat modeling', 'PCI DSS']),
        dec('pros-contras', 'Pros and cons of building your own payment gateway',
          'Pros: no per-transaction fees, control over the money cycle (settlement, reconciliation, refunds), owned data and flows a generic provider does not offer.\n\nCons: taking on regulatory and compliance responsibility, fraud and chargebacks, continuous operations and the fragility of integrating banks (formats, windows, outages). There is opportunity cost and a team to sustain.\n\nThat is why the decision is only justified with enough volume and bank access, and why we kept Stripe where the fee pays for the convenience. If I did it again, I would start with a provider and build the gateway once the numbers asked for it.',
          ['Trade-offs', 'FinOps', 'Compliance']),
        dec('retos', 'The most important technical challenges',
          '1. Consistency across systems: a payment involves the bank, the ledger and the signature; solved with sagas and compensations instead of distributed transactions.\n\n2. Duplicates and event ordering: delivery is at-least-once (SQS and SNS), so it was solved with idempotency and state machines.\n\n3. Bank reconciliation: different formats and timings; they are normalized and exceptions go to review.\n\n4. Third-party dependence: Seguridata and the banks fail; isolated with our own interfaces, retries and controlled degradation.\n\n5. Contract evolution: versioned webhooks and API so nobody who consumes them breaks.',
          ['Sagas', 'Eventual consistency', 'Resilience']),
        dec('rag', 'RAG with guardrails and evaluations',
          'Embedding pipeline and semantic search over a vector database to answer with our own context, with input and output guardrails and evaluations to catch out-of-scope answers before they reach the user.',
          ['RAG', 'LangChain', 'Embeddings', 'Vector databases']),
        dec('infra', 'Reproducible infrastructure, safe delivery and observability',
          'All infrastructure is defined as code with Terraform and deployed through CI/CD pipelines that run static and dependency analysis and block promotion to production on vulnerabilities. Observability relies on CloudWatch (metrics, logs and alarms) and Grafana or DataDog dashboards; dead-letter queues and reconciliation have their own alerts so we hear about problems before users do.',
          ['Terraform', 'CloudWatch', 'CI/CD', 'Grafana', 'DataDog']),
      ],
      business:
        'Together with business and legal we agreed on what needed legal validity (signature and NOM-151) and what could be solved with our own technology. We turned fees and regulatory risk into comparable options to justify the in-house gateway, and agreed on a staged delivery order.',
      leadership:
        'I documented decisions as ADRs (why a third party for signing, why an in-house gateway, why Ethereum), defined event and webhook contracts with their consumers, and left code reviews and operating guides (runbooks) for third-party failures.',
      practices: ['Event-driven architecture', 'Hexagonal architecture', 'Domain-Driven Design', 'Spec-Driven Development', 'Test-Driven Development', 'Continuous integration and delivery', 'Documented decisions (ADR)', 'Threat modeling', 'Outbox', 'Saga', 'Idempotency'],
      results: [
        'Signing and payment flows decoupled enough to tolerate third-party failures without losing operations.',
        'Charges without duplicates thanks to idempotency and reconciliation against the bank.',
        'One payments interface that allows using Stripe or the in-house gateway per flow.',
        'Legally valid evidence preserved per document (signature and NOM-151 certificate).',
      ],
    },
  },
};

// ─────────────────────────────── MÓVIL (Flutter + Cognito) ───────────────────────────────
const MOBILE = {
  es: {
    title: 'PastPost App – iOS & Android',
    description:
      'Versión móvil de PastPost para iOS y Android, hecha en Flutter y autenticada con Amazon Cognito. Comparte con la web el mismo backend serverless y orientado a eventos en AWS.',
    stack: ['Flutter', 'Dart', 'Amazon Cognito', 'OAuth2', 'OpenAPI', 'NestJS', 'Node.js', 'AWS', 'AWS Lambda', 'API Gateway', 'SQS/SNS', 'EventBridge', 'ECS Fargate', 'EC2', 'Kafka', 'RabbitMQ', 'CloudWatch', 'Terraform', 'Stripe', 'Seguridata', 'NOM-151'],
    caseStudy: {
      summary:
        'App móvil en Flutter autenticada con Amazon Cognito que comparte con la web el mismo backend serverless y orientado a eventos en AWS, incluidas la firma digital con NOM-151 y los pagos.',
      role: 'Backend Developer / Cloud & DevOps: contratos de API y autenticación para la app, y el backend compartido con la versión web.',
      challenge:
        'Dar a la app las mismas capacidades que la web (documentos, firma con validez legal y pagos) sobre el mismo backend, sin duplicar lógica y con versiones instaladas que no se pueden obligar a actualizar.',
      decisions: [
        dec('backend-compartido', 'Un solo backend para web y móvil',
          'La app Flutter consume los mismos servicios que la web: serverless y orientados a eventos en AWS, con SQS, SNS, EventBridge y Kafka o RabbitMQ según el caso, y contenedores en Fargate o EC2 para las cargas que lo piden. Lo que cambia entre canales está en el borde (identidad y experiencia), no en el dominio. Una regla de negocio se implementa una vez y las dos aplicaciones evolucionan sin divergir.',
          ['AWS Lambda', 'Amazon SQS', 'Amazon SNS', 'EventBridge', 'ECS Fargate']),
        dec('cognito', 'Identidad con Amazon Cognito',
          'En móvil usamos Cognito para el registro, el inicio de sesión y la renovación de tokens, mientras la web usa Auth0. La API valida los JWT de ambos en una sola capa y entrega a los servicios una identidad normalizada, de modo que el backend no depende del proveedor. Los tokens son de vida corta, se renuevan de forma segura y se guardan en el almacenamiento seguro del sistema.',
          ['Amazon Cognito', 'OAuth2/OIDC', 'JWT']),
        dec('contratos', 'Contratos de API versionados para apps instaladas',
          'A diferencia de la web, en móvil conviven versiones antiguas de la app. Las APIs se especifican primero (OpenAPI), se versionan y son compatibles hacia atrás: una versión nueva no rompe a quien no actualizó, y los cambios incompatibles se anuncian con un periodo de transición. Los DTOs validan cada entrada y las pruebas de contrato fallan si el backend se aparta de la especificación.',
          ['OpenAPI', 'Spec-Driven Development', 'Pruebas de contrato']),
        dec('firma-movil', 'Firma digital y NOM-151 desde el móvil',
          'La firma sigue el mismo flujo que en la web: se calcula la huella del documento, Seguridata firma y emite la constancia NOM-151, y la evidencia queda asociada al documento. La app solo inicia el proceso y consulta su estado; el trabajo corre en segundo plano mediante colas con reintentos, así una conexión móvil inestable no deja la firma a medias.',
          ['Seguridata', 'NOM-151', 'Colas con reintentos']),
        dec('pagos-movil', 'Pagos: Stripe o la pasarela propia con la misma interfaz',
          'Los pagos reutilizan la capa de la web: una interfaz común con un adaptador para Stripe y otro para la pasarela propia, con idempotencia, webhooks firmados y conciliación. La app inicia el pago y consulta su estado, pero la confirmación llega por webhook al backend, que es la fuente de verdad; nunca se confía en la respuesta del cliente. El diseño completo (libro contable, conciliación, seguridad y trade-offs) está en el caso de PastPost – Legado digital.',
          ['Stripe', 'Webhooks', 'Idempotencia']),
        dec('retos-movil', 'Retos técnicos del canal móvil',
          '1. Versiones antiguas conviviendo: contratos versionados y compatibilidad hacia atrás.\n\n2. Redes móviles inestables: reintentos con idempotencia para que repetir una petición no duplique cobros ni firmas.\n\n3. Sesiones y tokens que expiran con la app en segundo plano: renovación segura y manejo claro de la sesión caducada.\n\n4. Coordinar lanzamientos con las tiendas: un cambio de backend no puede depender de que todos actualicen.',
          ['Idempotencia', 'Compatibilidad hacia atrás', 'Resiliencia']),
        dec('infra-movil', 'Infraestructura y entrega',
          'La misma infraestructura como código (Terraform) y los mismos pipelines CI/CD con análisis estático y de dependencias que la web; observabilidad con CloudWatch y alertas sobre colas de mensajes fallidos y fallas de integración con terceros.',
          ['Terraform', 'CloudWatch', 'CI/CD']),
      ],
      business:
        'Acordamos con producto qué se resuelve en la app y qué se delega al backend para no duplicar reglas, y cómo avanzar por etapas sin depender de que todos los usuarios actualicen la app.',
      leadership: 'Coordiné con quienes desarrollan la app los contratos de API y los flujos asíncronos de firma y pago, y documenté los endpoints y las decisiones de compatibilidad.',
      practices: ['Spec-Driven Development', 'Arquitectura hexagonal', 'Test-Driven Development', 'Integración y entrega continuas', 'Idempotencia', 'Adapter'],
      results: [
        'Un solo backend para web y móvil, sin lógica de negocio duplicada.',
        'Cambios de API sin romper las versiones ya instaladas.',
        'Firma y pagos que sobreviven a conexiones inestables sin duplicarse.',
      ],
    },
  },
  en: {
    title: 'PastPost App – iOS & Android',
    description:
      'Mobile version of PastPost for iOS and Android, built with Flutter and authenticated with Amazon Cognito. It shares the same serverless, event-driven AWS backend as the web.',
    stack: null,
    caseStudy: {
      summary:
        'Flutter mobile app authenticated with Amazon Cognito that shares with the web the same serverless, event-driven AWS backend, including NOM-151 digital signatures and payments.',
      role: 'Backend Developer / Cloud & DevOps: API contracts and authentication for the app, and the backend shared with the web version.',
      challenge:
        'Give the app the same capabilities as the web (documents, legally valid signatures and payments) on the same backend, without duplicating logic and with installed versions we cannot force to update.',
      decisions: [
        dec('backend-compartido', 'One backend for web and mobile',
          'The Flutter app consumes the same services as the web: serverless and event-driven on AWS, with SQS, SNS, EventBridge and Kafka or RabbitMQ as needed, and containers on Fargate or EC2 for workloads that call for it. What differs between channels lives at the edge (identity and experience), not in the domain. A business rule is implemented once and both apps evolve without diverging.',
          ['AWS Lambda', 'Amazon SQS', 'Amazon SNS', 'EventBridge', 'ECS Fargate']),
        dec('cognito', 'Identity with Amazon Cognito',
          'On mobile we use Cognito for sign-up, sign-in and token renewal, while the web uses Auth0. The API validates both providers’ JWTs in a single layer and hands services a normalized identity, so the backend does not depend on the provider. Tokens are short-lived, renewed securely and kept in the system’s secure storage.',
          ['Amazon Cognito', 'OAuth2/OIDC', 'JWT']),
        dec('contratos', 'Versioned API contracts for installed apps',
          'Unlike the web, old app versions coexist on mobile. APIs are specified first (OpenAPI), versioned and backward compatible: a new version does not break whoever has not updated, and incompatible changes are announced with a transition period. DTOs validate every input and contract tests fail if the backend drifts from the specification.',
          ['OpenAPI', 'Spec-Driven Development', 'Contract tests']),
        dec('firma-movil', 'Digital signature and NOM-151 from mobile',
          'Signing follows the same flow as on the web: the document fingerprint is computed, Seguridata signs and issues the NOM-151 certificate, and the evidence is attached to the document. The app only starts the process and queries its status; the work runs in the background through queues with retries, so an unstable mobile connection never leaves a signature half done.',
          ['Seguridata', 'NOM-151', 'Queues with retries']),
        dec('pagos-movil', 'Payments: Stripe or the in-house gateway behind the same interface',
          'Payments reuse the web layer: a common interface with one adapter for Stripe and another for the in-house gateway, with idempotency, signed webhooks and reconciliation. The app starts the payment and queries its status, but confirmation arrives by webhook at the backend, which is the source of truth; the client’s response is never trusted. The full design (ledger, reconciliation, security and trade-offs) is in the PastPost – Digital Legacy case.',
          ['Stripe', 'Webhooks', 'Idempotency']),
        dec('retos-movil', 'Technical challenges of the mobile channel',
          '1. Old versions coexisting: versioned contracts and backward compatibility.\n\n2. Unstable mobile networks: retries with idempotency so repeating a request does not duplicate charges or signatures.\n\n3. Sessions and tokens that expire while the app is in the background: secure renewal and clear handling of an expired session.\n\n4. Coordinating releases with the stores: a backend change cannot depend on everyone updating.',
          ['Idempotency', 'Backward compatibility', 'Resilience']),
        dec('infra-movil', 'Infrastructure and delivery',
          'The same infrastructure as code (Terraform) and the same CI/CD pipelines with static and dependency analysis as the web; observability with CloudWatch and alerts on dead-letter queues and third-party integration failures.',
          ['Terraform', 'CloudWatch', 'CI/CD']),
      ],
      business:
        'We agreed with product what is solved in the app and what is delegated to the backend to avoid duplicating rules, and how to advance in stages without depending on every user updating the app.',
      leadership: 'I coordinated API contracts and the asynchronous signing and payment flows with the app developers, and documented endpoints and compatibility decisions.',
      practices: ['Spec-Driven Development', 'Hexagonal architecture', 'Test-Driven Development', 'Continuous integration and delivery', 'Idempotency', 'Adapter'],
      results: [
        'A single backend for web and mobile, with no duplicated business logic.',
        'API changes without breaking already-installed versions.',
        'Signing and payments that survive unstable connections without duplicating.',
      ],
    },
  },
};

const TARGETS = [
  { slug: 'pastpost-social-network', data: WEB },
  { slug: 'pastpost-mobile', data: MOBILE },
];

(async () => {
  const docs = await client.fetch('*[_type=="project" && slug.current in $slugs]{_id, language, "slug": slug.current, "decisions": caseStudy.decisions}', { slugs: TARGETS.map((t) => t.slug) });
  for (const d of docs) {
    const lang = d.language === 'en' ? 'en' : 'es';
    const target = TARGETS.find((t) => t.slug === d.slug).data;
    const content = target[lang];
    const stack = content.stack || target.es.stack;
    // Keep the already-approved Ethereum decision on the web case, placed after the payments block.
    const existing = (d.decisions || []).find((x) => x._key === 'blockchain-policies');
    let decisions = content.caseStudy.decisions;
    if (d.slug === 'pastpost-social-network' && existing) {
      const at = decisions.findIndex((x) => x._key === 'retos');
      decisions = [...decisions.slice(0, at), existing, ...decisions.slice(at)];
    }
    await client
      .patch(d._id)
      .set({
        title: content.title,
        description: content.description,
        stack,
        caseStudy: { ...content.caseStudy, decisions },
      })
      .commit();
    console.log('updated', d.slug, lang, `(${decisions.length} decisions, ${stack.length} tools)`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
