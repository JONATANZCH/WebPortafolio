/**
 * Publica dos artículos (ES/EN) inspirados en el video de Joaquín Ruiz sobre SDD vs ODD.
 * Uso: node scripts/add-articles-odd.cjs [--apply]
 * Idempotente: usa createOrReplace con ids fijos.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const APPLY = process.argv.includes('--apply');
const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

const VIDEO = 'https://www.youtube.com/watch?v=so2heYcfMW8';

// ── tiny portable-text builder: supports [text](url) links and **bold** ─────
let k = 0;
const key = () => `k${(k++).toString(36)}`;
function inline(text) {
  const markDefs = [];
  const children = [];
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)/g;
  let last = 0;
  let m;
  const push = (t, marks = []) => t && children.push({ _key: key(), _type: 'span', marks, text: t });
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[1]) {
      const id = key();
      markDefs.push({ _key: id, _type: 'link', href: m[3] });
      push(m[2], [id]);
    } else {
      push(m[5], ['strong']);
    }
    last = m.index + m[0].length;
  }
  push(text.slice(last));
  return { children, markDefs };
}
const block = (style, text, extra = {}) => ({ _key: key(), _type: 'block', style, ...inline(text), ...extra });
const p = (t) => block('normal', t);
const h2 = (t) => block('h2', t);
const quote = (t) => block('blockquote', t);
const bullet = (t) => block('normal', t, { listItem: 'bullet', level: 1 });
const num = (t) => block('normal', t, { listItem: 'number', level: 1 });

const ES1 = {
  title: 'El agente dijo que no había riesgos. Sí los había',
  excerpt: 'Un video enfrenta Spec Kit (SDD) contra el ODD de gentle-ai con la misma spec y el mismo modelo. Mi lectura: la ceremonia debe ser proporcional, y el valor del SDD está en el paso que te obliga a buscar riesgos.',
  body: [
    p('Llevo tiempo defendiendo que escribir la especificación antes del código es una de las mejores decisiones que puede tomar un equipo. Por eso me llamó la atención un [video de Joaquín Ruiz](' + VIDEO + ') cuyo título lo dice todo: dejó de usar Spec-Driven Development para todo y ahora practica algo que llama ODD, Organic Driven Development. No lo leí como una traición a la idea, sino como una pregunta incómoda y útil: ¿cuánta ceremonia merece cada tarea?'),
    p('Aviso importante: **no repliqué la prueba**. Lo que sigue es mi lectura del video y mi opinión sobre cómo encaja con la forma en que trabajo.'),
    h2('El experimento, en pocas palabras'),
    p('El video enfrenta el flujo SDD de Spec Kit contra el ODD de gentle-ai bajo las mismas condiciones: la misma feature (dependencias entre tareas en una API de tareas hecha con Flask), la misma especificación de 12 requisitos, el mismo modelo y la misma versión de Claude Code. Además, hay una batería de pruebas oculta que ningún agente llegó a ver.'),
    p('Los dos cumplieron los 12 requisitos. La diferencia estuvo en el camino:'),
    bullet('ODD terminó en 1,4 minutos y con 0,38 dólares, porque trató la feature como una tarea pequeña y no escribió documentación.'),
    bullet('Spec Kit tardó 6,2 minutos y costó 1,44 dólares, y dejó 605 líneas de documentación repartidas en 8 archivos antes de tocar el código.'),
    p('La idea de fondo del ODD es sencilla: no todas las tareas merecen la misma ceremonia. En lugar de decidirlo tú, el agente clasifica la tarea y solo abre un documento con la spec si es grande.'),
    h2('El detalle que más me interesó: el error que nadie corrigió'),
    p('Ambos dejaron escondido el mismo fallo: si llegan dos peticiones iguales al mismo tiempo, la API puede responder con un error 500. El paso de análisis de Spec Kit lo detectó y lo marcó como menor, pero nadie lo arregló. ODD, en cambio, cerró afirmando que el riesgo era ninguno, con exactamente el mismo hueco en su código.'),
    p('Era el mismo modelo en los dos casos. Lo que cambia es que el SDD incluye un paso que obliga a buscar riesgos y dejarlos por escrito, mientras que en ODD, tal como se probó, ese juicio lo hace el mismo agente que acaba de escribir el código.'),
    quote('Quien escribe el código es el peor candidato para declarar que no tiene riesgos.'),
    p('Con las personas pasa igual, y por eso existe el code review: alguien distinto ve lo que el autor no puede ver.'),
    h2('Lo que me llevo'),
    bullet('**La ceremonia debe ser proporcional.** Una tarea que cabe en una sesión no necesita un pipeline de documentos. Una que cruza equipos, expone una API que otros consumen o va a vivir meses, sí.'),
    bullet('**El valor del SDD no está en los documentos, sino en el paso que te obliga a pensar en riesgos.** Si quito los documentos, ese paso tendría que sobrevivir.'),
    bullet('**Separa a quien construye de quien revisa.** Da igual si es otra persona o un agente con otro prompt: el juicio sobre el riesgo no debería emitirlo solo el autor.'),
    bullet('**La prueba no mide lo que pasa con el tiempo.** Qué ocurre si la sesión se corta a la mitad, o si dentro de un mes alguien necesita saber por qué se tomó una decisión. Ahí una decisión escrita, como un ADR, se paga sola.'),
    h2('Cómo lo traduzco a mi forma de trabajar'),
    p('Mi postura no es "SDD siempre" ni "nunca". Es elegir el nivel de formalidad según el riesgo, el alcance y cuánto va a vivir el cambio. Para no decidirlo a ojo, armé una guía con tres niveles y cinco preguntas de riesgo: la dejé en el artículo [Cuánta ceremonia necesita una tarea](/es/blog/guia-ceremonia-niveles).'),
    p('Si trabajas con agentes de IA para programar, te recomiendo ver el [video completo](' + VIDEO + '): tiene el desglose por pasos, los resultados y un cierre honesto sobre lo que la prueba no mide. Todo el crédito de la comparación es de Joaquín Ruiz; lo mío es la opinión.'),
  ],
};

const EN1 = {
  title: "The agent said there were no risks. There were",
  excerpt: "A video pits Spec Kit (SDD) against gentle-ai's ODD with the same spec and the same model. My take: ceremony should be proportional, and the value of SDD is the step that forces you to look for risks.",
  body: [
    p("I have long argued that writing the specification before the code is one of the best decisions a team can make. That is why a [video by Joaquín Ruiz](" + VIDEO + ") caught my attention: its title says it all. He stopped using Spec-Driven Development for everything and now practices something he calls ODD, Organic Driven Development. I did not read it as a betrayal of the idea, but as an uncomfortable and useful question: how much ceremony does each task deserve?"),
    p("One important note: **I did not replicate the test**. What follows is my reading of the video and my opinion on how it fits the way I work."),
    h2('The experiment in a nutshell'),
    p("The video pits Spec Kit's SDD flow against gentle-ai's ODD under identical conditions: the same feature (task dependencies in a Flask-based task API), the same 12-requirement specification, the same model and the same Claude Code version. There is also a hidden test suite that no agent got to see."),
    p('Both met all 12 requirements. The difference was the road they took:'),
    bullet('ODD finished in 1.4 minutes and for $0.38, because it treated the feature as a small task and wrote no documentation.'),
    bullet('Spec Kit took 6.2 minutes and cost $1.44, and left 605 lines of documentation spread across 8 files before touching the code.'),
    p("The core idea of ODD is simple: not every task deserves the same ceremony. Instead of you deciding, the agent classifies the task and only opens a document with the spec if it is large."),
    h2('The detail that interested me most: the bug nobody fixed'),
    p("Both left the same flaw hidden: if two identical requests arrive at the same time, the API can answer with a 500 error. Spec Kit's analysis step caught it and flagged it as minor, but nobody fixed it. ODD, on the other hand, closed by stating the risk was none, with exactly the same gap in its code."),
    p("It was the same model in both cases. What changes is that SDD includes a step that forces you to look for risks and write them down, while in ODD, as it was tested, that judgment is made by the same agent that just wrote the code."),
    quote('The person who wrote the code is the worst candidate to declare it has no risks.'),
    p('People work the same way, which is why code review exists: someone else sees what the author cannot.'),
    h2('What I take away'),
    bullet("**Ceremony should be proportional.** A task that fits in one session does not need a document pipeline. One that crosses teams, exposes an API others consume or will live for months does."),
    bullet("**The value of SDD is not in the documents, but in the step that makes you think about risks.** If I remove the documents, that step should survive."),
    bullet("**Separate who builds from who reviews.** It does not matter whether it is another person or an agent with a different prompt: the judgment about risk should not come from the author alone."),
    bullet("**The test does not measure what happens over time.** What if the session is cut halfway, or a month from now someone needs to know why a decision was made? That is where a written decision, such as an ADR, pays for itself."),
    h2('How I translate it to my way of working'),
    p('My position is not "always SDD" or "never". It is choosing the level of formality according to risk, scope and how long the change will live. So I do not decide by gut feeling, I put together a guide with three levels and five risk questions: it is in the article [How much ceremony a task needs](/en/blog/guia-ceremonia-niveles).'),
    p("If you work with AI agents to code, I recommend watching the [full video](" + VIDEO + "): it has the step-by-step breakdown, the results and an honest closing about what the test does not measure. All credit for the comparison goes to Joaquín Ruiz; mine is the opinion."),
  ],
};

const ES2 = {
  title: 'Cuánta ceremonia necesita una tarea: mi guía para decidir entre un buen commit, una mini-spec o una spec completa',
  excerpt: 'Tres niveles de formalidad, las señales para subir de nivel y cinco preguntas de riesgo que respondo antes de dar algo por terminado.',
  body: [
    p('Después de ver la comparación entre SDD y ODD que comenté en [otro artículo](/es/blog/odd-vs-sdd-cuanta-ceremonia), me quedé con una pregunta práctica: ¿cómo decido, antes de empezar, cuánto proceso necesita una tarea? Esta es la guía que uso como punto de partida. No es una ley: es un criterio que ajusto según el equipo.'),
    h2('Nivel 0: cambio pequeño y reversible'),
    p('Un ajuste de texto, un bug acotado, una refactorización local. Basta con una prueba que lo cubra y un mensaje de commit que explique el porqué, no solo el qué.'),
    h2('Nivel 1: feature mediana'),
    p('Cabe en uno o dos días y toca un solo servicio. Escribo una mini-spec en la descripción del pull request: qué problema resuelve y criterios de aceptación en formato Given/When/Then. Las pruebas salen de esos criterios.'),
    h2('Nivel 2: grande, riesgosa o compartida'),
    p('Cruza equipos, expone una API que otros consumen, maneja datos sensibles o será difícil de revertir. Aquí sí justifico la ceremonia completa:'),
    bullet('Un contrato OpenAPI o un esquema revisado con quien lo consume.'),
    bullet('Un ADR con alternativas, consecuencias y decisión.'),
    bullet('Una revisión de riesgos por escrito.'),
    bullet('Pruebas de contrato en el pipeline de CI.'),
    h2('Señales para subir de nivel'),
    bullet('Cruza equipos o servicios.'),
    bullet('Lo consumen terceros o hay una API pública.'),
    bullet('Toca dinero o datos sensibles.'),
    bullet('Es difícil de revertir.'),
    bullet('Va a durar meses, o la persona que lo hace podría cambiar.'),
    bullet('Se hará en varias sesiones de trabajo.'),
    h2('Mis cinco preguntas de riesgo'),
    p('Sea cual sea el nivel, antes de dar algo por terminado me hago estas preguntas y las respondo por escrito en el pull request:'),
    num('¿Qué pasa si la misma petición llega dos veces o al mismo tiempo? (idempotencia, restricciones únicas, bloqueos)'),
    num('¿Qué pasa si una dependencia falla o tarda? (timeouts, reintentos, circuit breaker)'),
    num('¿Qué datos sensibles toca y quién puede verlos?'),
    num('¿Qué límites tiene la entrada? (tamaños, formatos, valores extremos)'),
    num('¿Cómo se revierte si sale mal?'),
    p('La primera pregunta es justo la del error 500 del video: dos peticiones iguales a la vez. No es un caso exótico, es de los fallos más comunes en producción, y es fácil pasarlo por alto cuando todo funciona en una prueba.'),
    h2('Quién hace la revisión'),
    quote('El autor tiende a no ver sus propios puntos ciegos.'),
    p('Cuando el riesgo es alto, que contesten la lista otra persona o, al menos, otro agente con un prompt distinto. Que el mismo que escribió el código declare "riesgo: ninguno" es justo el hueco que dejó expuesto la comparación.'),
    h2('Dónde dejo las decisiones'),
    p('Lo pequeño vive en el commit. Lo mediano, en el pull request. Lo que tiene consecuencias duraderas, en un ADR versionado junto al código. La regla: que dentro de seis meses alguien pueda entender por qué se hizo así.'),
    p('Esto es un punto de partida, ajústalo a tu equipo. Si quieres el contexto del que nació, mira el [video de Joaquín Ruiz](' + VIDEO + ') que comenté en el artículo anterior.'),
  ],
};

const EN2 = {
  title: 'How much ceremony a task needs: my guide to choosing between a good commit, a mini-spec or a full spec',
  excerpt: 'Three levels of formality, the signals to move up a level, and five risk questions I answer before calling something done.',
  body: [
    p("After watching the SDD versus ODD comparison I discussed in [another article](/en/blog/odd-vs-sdd-cuanta-ceremonia), I was left with a practical question: how do I decide, before starting, how much process a task needs? This is the guide I use as a starting point. It is not a law: it is a criterion I adjust to the team."),
    h2('Level 0: small, reversible change'),
    p('A text tweak, a contained bug, a local refactor. A test that covers it and a commit message that explains the why, not just the what, are enough.'),
    h2('Level 1: medium feature'),
    p("It fits in a day or two and touches a single service. I write a mini-spec in the pull request description: what problem it solves and acceptance criteria in Given/When/Then format. The tests come from those criteria."),
    h2('Level 2: large, risky or shared'),
    p('It crosses teams, exposes an API others consume, handles sensitive data or will be hard to revert. Here I do justify the full ceremony:'),
    bullet('An OpenAPI contract or schema reviewed with whoever consumes it.'),
    bullet('An ADR with alternatives, consequences and the decision.'),
    bullet('A written risk review.'),
    bullet('Contract tests in the CI pipeline.'),
    h2('Signals to move up a level'),
    bullet('It crosses teams or services.'),
    bullet('Third parties consume it or there is a public API.'),
    bullet('It touches money or sensitive data.'),
    bullet('It is hard to revert.'),
    bullet('It will last months, or the person doing it might change.'),
    bullet('It will be done over several work sessions.'),
    h2('My five risk questions'),
    p('Whatever the level, before calling something done I ask myself these questions and answer them in writing in the pull request:'),
    num('What happens if the same request arrives twice or at the same time? (idempotency, unique constraints, locks)'),
    num('What happens if a dependency fails or is slow? (timeouts, retries, circuit breaker)'),
    num('What sensitive data does it touch and who can see it?'),
    num('What are the limits of the input? (sizes, formats, extreme values)'),
    num('How is it reverted if it goes wrong?'),
    p("The first question is exactly the video's 500 error: two identical requests at once. It is not an exotic case, it is one of the most common production failures, and it is easy to miss when everything passes in a test."),
    h2('Who does the review'),
    quote('The author tends not to see their own blind spots.'),
    p('When the risk is high, have someone else answer the list or, at least, another agent with a different prompt. Letting the one who wrote the code declare "risk: none" is exactly the gap the comparison exposed.'),
    h2('Where I leave decisions'),
    p('Small things live in the commit. Medium ones, in the pull request. Anything with lasting consequences, in an ADR versioned next to the code. The rule: six months from now, someone should be able to understand why it was done this way.'),
    p("This is a starting point, adjust it to your team. If you want the context it came from, watch the [video by Joaquín Ruiz](" + VIDEO + ") I discussed in the previous article."),
  ],
};

const posts = [
  { id: 'post-odd-sdd-es', language: 'es', slug: 'odd-vs-sdd-cuanta-ceremonia', date: '2026-11-07T15:00:00Z', ...ES1 },
  { id: 'post-odd-sdd-en', language: 'en', slug: 'odd-vs-sdd-cuanta-ceremonia', date: '2026-11-07T15:00:00Z', ...EN1 },
  { id: 'post-ceremonia-es', language: 'es', slug: 'guia-ceremonia-niveles', date: '2026-11-07T14:00:00Z', ...ES2 },
  { id: 'post-ceremonia-en', language: 'en', slug: 'guia-ceremonia-niveles', date: '2026-11-07T14:00:00Z', ...EN2 },
];

(async () => {
  console.log(posts.length, 'posts', APPLY ? '(APPLY)' : '(dry-run)');
  for (const x of posts) {
    const doc = {
      _id: x.id,
      _type: 'post',
      language: x.language,
      title: x.title,
      slug: { _type: 'slug', current: x.slug },
      excerpt: x.excerpt,
      publishedAt: x.date,
      body: x.body,
    };
    console.log(' -', x.language, x.slug, x.title.slice(0, 60), `(${x.body.length} blocks)`);
    if (APPLY) await client.createOrReplace(doc);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
