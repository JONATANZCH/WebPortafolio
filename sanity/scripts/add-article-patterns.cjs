/**
 * Artículo (ES/EN): los patrones de diseño no murieron, se volvieron invisibles.
 * Uso: node scripts/add-article-patterns.cjs [--apply]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const APPLY = process.argv.includes('--apply');
const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

let k = 0;
const key = () => `p${(k++).toString(36)}`;
function inline(text) {
  const markDefs = [];
  const children = [];
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
  let last = 0;
  let m;
  const push = (t, marks = []) => t && children.push({ _key: key(), _type: 'span', marks, text: t });
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[1]) {
      const id = key();
      markDefs.push({ _key: id, _type: 'link', href: m[3] });
      push(m[2], [id]);
    } else if (m[4]) push(m[5], ['strong']);
    else push(m[7], ['code']);
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

const ES = {
  title: 'Los patrones de diseño no murieron: se volvieron invisibles',
  excerpt: 'Parecen estar en desuso, pero viven dentro de NestJS, Express, TypeORM y de los propios lenguajes. Por qué conviene reconocerlos, cuándo usarlos a mano y cuándo no.',
  body: [
    p('En las entrevistas siguen preguntando por patrones de diseño. En el código de producto casi nunca encuentro una clase llamada `StrategyFactoryManager`. Esa distancia me hizo una pregunta incómoda: ¿los patrones pasaron de moda, o simplemente ya no los vemos?'),
    p('Mi respuesta corta: **no murieron, se volvieron invisibles**. Los frameworks y los lenguajes absorbieron los más comunes, y eso es una buena noticia, siempre que sepas que están ahí.'),
    h2('Por qué parece que ya nadie los usa'),
    bullet('**Los frameworks ya los traen puestos.** Cuando abres un proyecto NestJS no escribes un contenedor de inyección de dependencias: ya existe. Usas el patrón sin haberlo implementado.'),
    bullet('**Los lenguajes absorbieron algunos.** Con funciones de primera clase, un Strategy o un Command suele ser una función que pasas como argumento. Un módulo de JavaScript ya es, en la práctica, un singleton.'),
    bullet('**Tienen mala fama por el abuso.** Todos hemos visto sobreingeniería: tres capas de abstracción para resolver un `if`. El patrón sin problema detrás es solo ruido.'),
    bullet('**Se enseñan como catálogo, no como problemas.** Memorizar diagramas UML no ayuda a reconocer cuándo hace falta uno.'),
    h2('Dónde viven hoy: ejemplos en NestJS y Node'),
    p('Una lectura rápida de un backend típico en NestJS ya está llena de patrones:'),
    bullet('**Singleton e inversión de dependencias:** los providers con `@Injectable()` son singleton por defecto y el contenedor se encarga de construirlos e inyectarlos.'),
    bullet('**Chain of Responsibility:** el middleware de Express, y en NestJS los guards, pipes e interceptors, forman una cadena por la que pasa cada petición.'),
    bullet('**Decorator:** un interceptor envuelve la ejecución del controlador para añadir registro, caché o transformación de la respuesta sin tocar el controlador.'),
    bullet('**Strategy:** las estrategias de autenticación de Passport (JWT, OAuth2, local) son intercambiables detrás de una interfaz común.'),
    bullet('**Observer:** el emisor de eventos y los eventos de dominio desacoplan a quien notifica de quien reacciona.'),
    bullet('**Repository:** los repositorios de TypeORM presentan la persistencia como una colección del dominio.'),
    bullet('**Factory:** los providers con `useFactory` deciden cómo construir una dependencia según la configuración.'),
    p('Si entiendes esto, el framework deja de ser magia: sabes por qué el orden de los interceptors importa, o por qué un provider con estado compartido puede darte un bug que solo aparece con tráfico real.'),
    h2('Cuándo conocerlos sí marca la diferencia'),
    bullet('**Para reconocer lo que ya estás usando.** Depurar es mucho más fácil cuando sabes qué patrón hay detrás de un comportamiento.'),
    bullet('**Para lo que el framework no trae.** NestJS resuelve lo genérico. Las reglas de tu negocio no vienen incluidas: un cotizador con reglas distintas por producto pide un Strategy, una integración con un sistema heredado pide un Adapter, y una operación distribuida pide Saga y Outbox.'),
    bullet('**Como vocabulario común.** En un pull request, decir "esto es un Adapter" ahorra tres párrafos de explicación.'),
    h2('Cuándo no usarlos'),
    quote('Un patrón es la solución a un problema que ya tienes, no a uno que podrías tener.'),
    bullet('**Si todavía no se repite.** Espera a la tercera vez. Abstraer a la primera suele producir la abstracción equivocada.'),
    bullet('**Si el lenguaje ya lo resuelve.** Una función en un mapa puede ser mejor que una jerarquía de clases Strategy.'),
    bullet('**Si añade más indirección de la que quita.** Cada capa tiene un costo de lectura para quien llega después.'),
    h2('Mi regla práctica'),
    p('Antes de introducir un patrón me hago tres preguntas: ¿qué problema concreto resuelve aquí?, ¿cuánto cuesta el cambio que quiero facilitar?, ¿el framework o el lenguaje ya lo hace? Si no puedo responder la primera con un ejemplo real, no lo uso.'),
    p('En mi trabajo, por ejemplo, los uso donde de verdad duelen los cambios: un Strategy para que varios productos compartan el mismo flujo de cotización, o un Adapter para aislar un sistema heredado del dominio. Puedes verlos en los casos de [Mi Seguro](/es/projects/liverpool-seguros) y [Suburbia](/es/projects/suburbia-seguros), y repasar cuáles uso en cada etapa en la sección [Cómo trabajo](/es#proceso).'),
    p('Los patrones no son una meta. Son un vocabulario para pensar mejor, y el mejor momento para aprenderlo es antes de necesitarlo.'),
  ],
};

const EN = {
  title: "Design patterns didn't die: they became invisible",
  excerpt: "They seem unused, but they live inside NestJS, Express, TypeORM and the languages themselves. Why it pays to recognize them, when to write them by hand and when not to.",
  body: [
    p("Interviews still ask about design patterns. In product code I almost never find a class named `StrategyFactoryManager`. That gap raised an uncomfortable question: did patterns go out of fashion, or do we simply no longer see them?"),
    p("My short answer: **they did not die, they became invisible**. Frameworks and languages absorbed the most common ones, and that is good news, as long as you know they are there."),
    h2('Why it seems nobody uses them anymore'),
    bullet("**Frameworks ship with them built in.** When you open a NestJS project you do not write a dependency injection container: it already exists. You use the pattern without having implemented it."),
    bullet("**Languages absorbed some of them.** With first-class functions, a Strategy or a Command is often just a function you pass as an argument. A JavaScript module is, in practice, already a singleton."),
    bullet("**They have a bad reputation from overuse.** We have all seen over-engineering: three layers of abstraction to solve an `if`. A pattern without a problem behind it is just noise."),
    bullet("**They are taught as a catalog, not as problems.** Memorizing UML diagrams does not help you recognize when one is needed."),
    h2('Where they live today: examples in NestJS and Node'),
    p('A quick read of a typical NestJS backend is already full of patterns:'),
    bullet("**Singleton and dependency inversion:** providers marked `@Injectable()` are singletons by default, and the container builds and injects them."),
    bullet("**Chain of Responsibility:** Express middleware, and in NestJS guards, pipes and interceptors, form a chain every request travels through."),
    bullet("**Decorator:** an interceptor wraps the controller's execution to add logging, caching or response transformation without touching the controller."),
    bullet("**Strategy:** Passport's authentication strategies (JWT, OAuth2, local) are interchangeable behind a common interface."),
    bullet("**Observer:** the event emitter and domain events decouple whoever notifies from whoever reacts."),
    bullet("**Repository:** TypeORM repositories present persistence as a domain collection."),
    bullet("**Factory:** providers with `useFactory` decide how to build a dependency based on configuration."),
    p("Once you understand this, the framework stops being magic: you know why the order of interceptors matters, or why a provider with shared state can give you a bug that only shows up under real traffic."),
    h2('When knowing them really makes a difference'),
    bullet("**To recognize what you are already using.** Debugging is much easier when you know which pattern is behind a behavior."),
    bullet("**For what the framework does not ship.** NestJS solves the generic. Your business rules do not come included: a quoter with different rules per product calls for a Strategy, an integration with a legacy system calls for an Adapter, and a distributed operation calls for Saga and Outbox."),
    bullet('**As a shared vocabulary.** In a pull request, saying "this is an Adapter" saves three paragraphs of explanation.'),
    h2('When not to use them'),
    quote('A pattern is the solution to a problem you already have, not to one you might have.'),
    bullet("**If it does not repeat yet.** Wait for the third time. Abstracting on the first often produces the wrong abstraction."),
    bullet("**If the language already solves it.** A function in a map can beat a hierarchy of Strategy classes."),
    bullet("**If it adds more indirection than it removes.** Every layer has a reading cost for whoever arrives later."),
    h2('My practical rule'),
    p("Before introducing a pattern I ask myself three questions: what concrete problem does it solve here, how much does the change I want to ease cost, and does the framework or the language already do it? If I cannot answer the first with a real example, I do not use it."),
    p("In my work, for instance, I use them where changes truly hurt: a Strategy so several products share the same quoting flow, or an Adapter to isolate a legacy system from the domain. You can see them in the [Mi Seguro](/en/projects/liverpool-seguros) and [Suburbia](/en/projects/suburbia-seguros) case studies, and review which ones I use at each stage in the [How I work](/en#proceso) section."),
    p("Patterns are not a goal. They are a vocabulary for thinking better, and the best time to learn it is before you need it."),
  ],
};
// fix accidental relative path typo in ES link
ES.body.forEach((b) => b.markDefs && b.markDefs.forEach((d) => { if (d.href === '/es/blog/../projects/liverpool-seguros') d.href = '/es/projects/liverpool-seguros'; }));

const posts = [
  { id: 'post-patrones-es', language: 'es', slug: 'patrones-de-diseno-invisibles', date: '2026-11-07T18:00:00Z', ...ES },
  { id: 'post-patrones-en', language: 'en', slug: 'patrones-de-diseno-invisibles', date: '2026-11-07T18:00:00Z', ...EN },
];

(async () => {
  console.log(posts.length, 'posts', APPLY ? '(APPLY)' : '(dry-run)');
  for (const x of posts) {
    console.log(' -', x.language, x.slug, x.title, `(${x.body.length} blocks)`);
    if (APPLY) {
      await client.createOrReplace({
        _id: x.id,
        _type: 'post',
        language: x.language,
        title: x.title,
        slug: { _type: 'slug', current: x.slug },
        excerpt: x.excerpt,
        publishedAt: x.date,
        body: x.body,
      });
    }
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
