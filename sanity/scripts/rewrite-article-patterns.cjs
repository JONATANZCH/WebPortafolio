/**
 * Reescribe el artículo "Los patrones de diseño no murieron: se volvieron invisibles" (ES/EN):
 * ahora cubre Spring Boot, NestJS, FastAPI y Go, además de POO y SOLID sin clases.
 * Conserva id, slug y fecha. Uso: node scripts/rewrite-article-patterns.cjs [--apply]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const APPLY = process.argv.includes('--apply');
const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

let k = 0;
const key = () => `r${(k++).toString(36)}`;
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
const h3 = (t) => block('h3', t);
const quote = (t) => block('blockquote', t);
const bullet = (t) => block('normal', t, { listItem: 'bullet', level: 1 });

const ES = {
  title: "Los patrones de diseño no murieron: se volvieron invisibles",
  excerpt: "Casi nunca ves un Strategy con ese nombre en un backend moderno, pero NestJS, Spring Boot, FastAPI y Go están hechos de patrones. Dónde se esconden en cada lenguaje, qué pasa con POO y SOLID cuando ya nadie escribe «new», y cuándo conviene sacarlos a la luz.",
  body: [
    p("En las entrevistas te piden implementar un Singleton seguro para hilos en un pizarrón. En el trabajo escribes `@Injectable()`, el framework lo resuelve y te vas a comer. Entre una escena y la otra queda una pregunta razonable: si los patrones de diseño son tan importantes, ¿por qué casi nunca veo uno con su nombre en el código de producto?"),
    p("Mi respuesta: no murieron, se mudaron. Primero de tu código al framework, y después del framework al lenguaje. Siguen ahí, trabajando en cada petición, solo que ya no llevan gafete. Y esa mudanza se ve distinta en cada ecosistema, que es justo lo que confunde."),

    h2("La ley de conservación de los patrones"),
    p("Un patrón es la respuesta a un problema que se repite. El problema no desaparece porque cambies de lenguaje; lo que cambia es quién escribe la respuesta. Yo lo pienso en tres estados:"),
    bullet("**Explícito:** lo escribes tú, con clases e interfaces. Es el patrón del libro."),
    bullet("**Absorbido por el framework:** tú solo lo activas con un decorador o una anotación. El patrón vive en una librería que nunca abres."),
    bullet("**Disuelto en el lenguaje:** ni siquiera lo notas. Un `for` sobre una colección es un Iterator; pasar una función como argumento es un Strategy."),
    p("El catálogo clásico se publicó en 1994 con ejemplos en C++ y Smalltalk, y varios de sus patrones compensaban cosas que esos lenguajes no traían. Poco después, Peter Norvig mostró que 16 de los 23 se vuelven más simples o directamente invisibles en lenguajes dinámicos. Los lenguajes modernos no dejaron de usar patrones: se los tragaron."),

    h2("El mismo patrón, cuatro acentos"),
    p("Lo que cambia de un ecosistema a otro no es si hay patrones, sino en cuál de los tres estados quedó cada uno."),

    h3("Java y Spring Boot: los patrones con gafete"),
    p("Java es el único ecosistema donde los patrones no se esconden: se anuncian. Spring tiene una clase llamada `AbstractSingletonProxyFactoryBean`; existe de verdad y nadie fue detenido por ello. Detrás de las anotaciones de todos los días hay un catálogo completo:"),
    bullet("**Proxy:** `@Transactional` no hace nada por sí sola. Spring envuelve tu clase en un proxy que abre y cierra la transacción alrededor del método."),
    bullet("**Template Method:** `JdbcTemplate` fija los pasos (abrir la conexión, ejecutar, manejar errores, cerrar) y tú solo aportas la consulta."),
    bullet("**Chain of Responsibility:** cada petición cruza la cadena de filtros de Spring Security antes de tocar tu controlador."),
    bullet("**Strategy:** si inyectas un `List<PaymentStrategy>`, Spring te entrega todas las implementaciones. Agregar una nueva no toca las existentes."),
    bullet("**Factory y Singleton:** el contenedor crea los beans y, por defecto, mantiene una sola instancia de cada uno."),
    bullet("**Repository:** en Spring Data declaras una interfaz y jamás escribes su implementación; se genera en tiempo de ejecución."),
    bullet("**Observer:** `@EventListener` reacciona a eventos que otro componente publicó sin conocerlo."),

    h3("NestJS: el mismo catálogo con otra sintaxis"),
    p("NestJS tomó la idea de Spring y de Angular y la tradujo a TypeScript. Los providers con `@Injectable()` son singleton por defecto y el contenedor los inyecta por constructor. Guards, pipes e interceptors forman una cadena que cada petición recorre en orden, y un interceptor es un Decorator que envuelve al controlador para añadir registro, caché o transformación. Las estrategias de Passport (JWT, OAuth2, local) son Strategy con ese nombre exacto, y `useFactory` es una fábrica que decide cómo construir una dependencia según la configuración."),

    h3("Python y FastAPI: los patrones sin uniforme"),
    p("Aquí es donde más gente concluye que «en Python no se usan patrones». Un endpoint de FastAPI es una función: no hay clase, no hay `new`, no hay interfaz. Pero mira lo que pasa alrededor:"),
    bullet("**Inyección de dependencias:** `Depends(get_db)` es inversión de dependencias pura. El endpoint declara qué necesita y no sabe quién lo construye; en pruebas, `dependency_overrides` cambia la implementación sin tocar el endpoint."),
    bullet("**Singleton:** Python lo resolvió hace décadas y lo llamó «módulo». Un módulo se importa una vez y se reutiliza; para la configuración, la propia documentación de FastAPI sugiere una función con `lru_cache`."),
    bullet("**Strategy:** un diccionario de funciones. `handlers[tipo](pedido)` hace el trabajo de una jerarquía de clases en una línea."),
    bullet("**Decorator:** viene como sintaxis del lenguaje: una función que envuelve a otra para sumarle caché, reintentos o registro. `@app.get` usa esa misma sintaxis para registrar la ruta."),
    bullet("**Iterator y Template Method:** los generadores y los bloques `with` son parte del lenguaje. Una dependencia con `yield` ejecuta código antes y después de tu endpoint, como abrir y cerrar una sesión de base de datos."),

    h3("Go: sin clases, sin herencia y sin paciencia para la ceremonia"),
    p("Go no tiene clases ni herencia, y aun así su librería estándar es una clase magistral de patrones. Un middleware HTTP es una función que recibe un `http.Handler` y devuelve otro: Decorator y Chain of Responsibility en una sola firma. `http.HandlerFunc` es un Adapter de manual, porque convierte una función común en algo que cumple la interfaz. Las interfaces son pequeñas (`io.Reader` tiene un solo método) y se cumplen de forma implícita, sin declarar que las implementas. Y el Singleton se llama `sync.Once`."),
    p("La lista sigue: el pipeline de middleware y los ciclos de vida del contenedor en ASP.NET Core, Active Record en Rails y Laravel con ese nombre exacto, las señales de Django como Observer, el `EventEmitter` de Node. Distinto acento, mismo idioma."),

    h2("«¿Y dónde quedó el objeto?» POO cuando ya nadie escribe new"),
    p("Hay una segunda sospecha, más profunda: mucho de este código no parece orientado a objetos. En FastAPI y en Go casi no hay clases. En NestJS y Spring sí las hay, pero nunca las instancias tú: el contenedor hace todos los `new`. Es el principio de Hollywood: no nos llames, nosotros te llamamos."),
    p("Mi lectura es que confundimos la orientación a objetos con su sintaxis. Lo valioso nunca fue la palabra `class`, sino tres ideas: encapsular, depender de contratos en lugar de implementaciones y poder sustituir una pieza por otra. Go lo logra con interfaces implícitas, Python con duck typing y `Protocol`, TypeScript con tipos estructurales. Polimorfismo sin árbol genealógico."),
    p("Y aquí viene la parte incómoda. Un servicio típico de Spring o NestJS es una clase sin estado, con una sola instancia, cuyos métodos reciben datos y devuelven datos. Eso es programación procedural con traje de objetos: un módulo de funciones con las dependencias inyectadas. Mientras tanto, la función «nada orientada a objetos» de FastAPI que recibe su repositorio por `Depends` aplica inversión de dependencias de libro. La orientación a objetos no está en la sintaxis; está en hacia dónde apuntan las dependencias."),
    p("Donde los objetos de verdad siguen ganando es en el dominio: un agregado que protege sus reglas, un objeto de valor que no puede existir en un estado inválido. Ahí sí conviene una clase con comportamiento, en cualquier lenguaje."),

    h2("SOLID sin clases también es SOLID"),
    p("Los cinco principios se enseñan con clases, pero ninguno depende de ellas:"),
    bullet("**Responsabilidad única:** aplica igual a una función, a un módulo de Python o a un paquete de Go. La pregunta es la misma: ¿cuántas razones tiene esto para cambiar?"),
    bullet("**Abierto/cerrado:** agregar una entrada a un diccionario de estrategias, registrar un handler nuevo o crear un bean que implementa la interfaz. En los tres casos sumas comportamiento sin editar el que ya existe."),
    bullet("**Sustitución de Liskov:** con duck typing nadie te obliga a cumplir el contrato, y eso lo vuelve más importante, no menos. Si algo dice ser un repositorio, debe comportarse como uno; tus pruebas y el verificador de tipos hacen de compilador."),
    bullet("**Segregación de interfaces:** Go la lleva al extremo con interfaces de un solo método. Uno de sus proverbios dice que cuanto más grande es la interfaz, más débil es la abstracción."),
    bullet("**Inversión de dependencias:** el constructor en Spring y NestJS, `Depends` en FastAPI, una función `NewService(repo)` en Go. Cuatro sintaxis para la misma flecha."),

    h2("Lo invisible muerde justo donde no lo ves"),
    p("Reconocer el patrón no es cultura general: es lo que te ahorra la tarde de depuración. Los errores más desconcertantes de cada framework viven en la costura del patrón escondido:"),
    bullet("**Spring:** llamas a un método `@Transactional` desde otro método de la misma clase y la transacción no se abre. La llamada interna no pasa por el proxy. Si sabes que hay un Proxy, el misterio dura un minuto."),
    bullet("**NestJS:** un provider con alcance de petición contagia ese alcance a todo el que lo inyecta, y de pronto tus supuestos singletons se crean en cada petición."),
    bullet("**FastAPI:** una dependencia usada dos veces en la misma petición se ejecuta una sola vez, porque su resultado se guarda durante esa petición. Y un «singleton» a nivel de módulo comparte su estado entre pruebas."),
    bullet("**Go:** una interfaz que contiene un puntero nulo no es igual a `nil`, y tu `if err != nil` entra cuando jurarías que no debería."),
    p("En los cuatro casos el framework no está roto. Está aplicando un patrón que no sabías que estaba ahí."),

    h2("Cuándo sacarlos a la luz y cuándo no"),
    quote("Un patrón es la solución a un problema que ya tienes, no a uno que podrías tener."),
    bullet("**Escríbelo cuando el framework no llega.** Spring y NestJS resuelven lo genérico; las reglas de tu negocio no vienen incluidas."),
    bullet("**Espera a la tercera repetición.** Abstraer a la primera suele producir la abstracción equivocada."),
    bullet("**Usa la versión más barata que tu lenguaje permita.** Si un diccionario de funciones resuelve el Strategy, no construyas la jerarquía de clases por nostalgia."),
    bullet("**Nómbralo en la revisión de código.** Decir «esto es un Adapter» ahorra tres párrafos de explicación."),
    p("Antes de introducir uno me hago tres preguntas: ¿qué problema concreto resuelve aquí?, ¿cuánto cuesta el cambio si no lo uso? y ¿lo entenderá sin ayuda quien llegue en seis meses?"),
    p("En mi trabajo los uso donde de verdad duelen los cambios: un Strategy para que cinco seguros compartan el mismo cotizador en [Mi Seguro Liverpool](/es/projects/liverpool-seguros), y un Adapter para que Stripe y una pasarela propia vivan detrás de la misma interfaz en [PastPost](/es/projects/pastpost-social-network)."),
    p("Los patrones no son una meta ni una moda vencida. Son el idioma en el que están escritos tus frameworks. Puedes trabajar años sin hablarlo, igual que puedes vivir en otro país sin aprender el idioma: funciona, hasta el día en que necesitas leer la letra pequeña."),
  ],
};

const EN = {
  title: "Design patterns didn't die: they became invisible",
  excerpt: "You almost never see a Strategy by that name in a modern backend, yet NestJS, Spring Boot, FastAPI and Go are made of patterns. Where they hide in each language, what happens to OOP and SOLID when nobody writes “new” anymore, and when it pays to bring them back into the open.",
  body: [
    p("In interviews you are asked to implement a thread-safe Singleton on a whiteboard. At work you type `@Injectable()`, the framework takes care of it and you go to lunch. Between those two scenes sits a fair question: if design patterns matter so much, why do I almost never see one by name in product code?"),
    p("My answer: they did not die, they moved. First from your code into the framework, and then from the framework into the language. They are still there, working on every request, they just stopped wearing a name tag. And that move looks different in every ecosystem, which is exactly what makes it confusing."),

    h2("The law of conservation of patterns"),
    p("A pattern is the answer to a recurring problem. The problem does not go away because you switch languages; what changes is who writes the answer. I think of it as three states:"),
    bullet("**Explicit:** you write it yourself, with classes and interfaces. This is the pattern from the book."),
    bullet("**Absorbed by the framework:** you only switch it on with a decorator or an annotation. The pattern lives in a library you never open."),
    bullet("**Dissolved into the language:** you do not even notice it. A `for` over a collection is an Iterator; passing a function as an argument is a Strategy."),
    p("The classic catalog was published in 1994 with examples in C++ and Smalltalk, and several of its patterns made up for things those languages lacked. Soon after, Peter Norvig showed that 16 of the 23 become simpler or outright invisible in dynamic languages. Modern languages did not stop using patterns: they swallowed them."),

    h2("Same pattern, four accents"),
    p("What changes from one ecosystem to the next is not whether patterns exist, but which of the three states each one ended up in."),

    h3("Java and Spring Boot: patterns with a name tag"),
    p("Java is the one ecosystem where patterns do not hide: they announce themselves. Spring has a class called `AbstractSingletonProxyFactoryBean`; it really exists and nobody was arrested for it. Behind the everyday annotations there is a full catalog:"),
    bullet("**Proxy:** `@Transactional` does nothing on its own. Spring wraps your class in a proxy that opens and closes the transaction around the method."),
    bullet("**Template Method:** `JdbcTemplate` fixes the steps (open the connection, execute, handle errors, close) and you only supply the query."),
    bullet("**Chain of Responsibility:** every request crosses the Spring Security filter chain before it touches your controller."),
    bullet("**Strategy:** inject a `List<PaymentStrategy>` and Spring hands you every implementation. Adding a new one does not touch the existing ones."),
    bullet("**Factory and Singleton:** the container creates the beans and, by default, keeps a single instance of each."),
    bullet("**Repository:** in Spring Data you declare an interface and never write its implementation; it is generated at runtime."),
    bullet("**Observer:** `@EventListener` reacts to events another component published without knowing it."),

    h3("NestJS: the same catalog in a different syntax"),
    p("NestJS took the idea from Spring and Angular and translated it to TypeScript. Providers marked `@Injectable()` are singletons by default and the container injects them through the constructor. Guards, pipes and interceptors form a chain every request walks in order, and an interceptor is a Decorator that wraps the controller to add logging, caching or transformation. Passport strategies (JWT, OAuth2, local) are Strategy by that exact name, and `useFactory` is a factory that decides how to build a dependency based on configuration."),

    h3("Python and FastAPI: patterns out of uniform"),
    p("This is where most people conclude that “Python does not use patterns”. A FastAPI endpoint is a function: no class, no `new`, no interface. But look at what happens around it:"),
    bullet("**Dependency injection:** `Depends(get_db)` is pure dependency inversion. The endpoint declares what it needs and does not know who builds it; in tests, `dependency_overrides` swaps the implementation without touching the endpoint."),
    bullet("**Singleton:** Python solved it decades ago and called it a “module”. A module is imported once and reused; for settings, FastAPI's own documentation suggests a function with `lru_cache`."),
    bullet("**Strategy:** a dictionary of functions. `handlers[kind](order)` does the job of a class hierarchy in one line."),
    bullet("**Decorator:** it ships as language syntax: a function that wraps another to add caching, retries or logging. `@app.get` uses that same syntax to register the route."),
    bullet("**Iterator and Template Method:** generators and `with` blocks are part of the language. A dependency with `yield` runs code before and after your endpoint, like opening and closing a database session."),

    h3("Go: no classes, no inheritance and no patience for ceremony"),
    p("Go has no classes and no inheritance, and its standard library is still a masterclass in patterns. An HTTP middleware is a function that takes an `http.Handler` and returns another: Decorator and Chain of Responsibility in a single signature. `http.HandlerFunc` is a textbook Adapter, because it turns a plain function into something that satisfies the interface. Interfaces are small (`io.Reader` has one method) and are satisfied implicitly, without declaring that you implement them. And the Singleton is called `sync.Once`."),
    p("The list goes on: the middleware pipeline and container lifetimes in ASP.NET Core, Active Record in Rails and Laravel by that exact name, Django signals as Observer, Node's `EventEmitter`. Different accent, same language."),

    h2("“So where did the object go?” OOP when nobody writes new anymore"),
    p("There is a second, deeper suspicion: a lot of this code does not look object-oriented. FastAPI and Go have almost no classes. NestJS and Spring do have them, but you never instantiate them yourself: the container does every `new`. It is the Hollywood principle: don't call us, we'll call you."),
    p("My reading is that we confuse object orientation with its syntax. The valuable part was never the word `class`, but three ideas: encapsulation, depending on contracts instead of implementations, and being able to swap one piece for another. Go gets there with implicit interfaces, Python with duck typing and `Protocol`, TypeScript with structural types. Polymorphism without a family tree."),
    p("And here comes the uncomfortable part. A typical Spring or NestJS service is a stateless class with a single instance, whose methods take data in and return data out. That is procedural programming in an object suit: a module of functions with injected dependencies. Meanwhile, the “not object-oriented at all” FastAPI function that receives its repository through `Depends` is applying textbook dependency inversion. Object orientation is not in the syntax; it is in which way the dependencies point."),
    p("Where real objects still win is the domain: an aggregate that protects its rules, a value object that cannot exist in an invalid state. That is where a class with behavior pays off, in any language."),

    h2("SOLID without classes is still SOLID"),
    p("The five principles are taught with classes, but none of them depends on classes:"),
    bullet("**Single responsibility:** it applies just as well to a function, a Python module or a Go package. The question is the same: how many reasons does this have to change?"),
    bullet("**Open/closed:** adding an entry to a dictionary of strategies, registering a new handler or creating a bean that implements the interface. In all three you add behavior without editing what already exists."),
    bullet("**Liskov substitution:** with duck typing nobody forces you to honor the contract, which makes it more important, not less. If something claims to be a repository, it must behave like one; your tests and the type checker play the role of the compiler."),
    bullet("**Interface segregation:** Go takes it to the extreme with single-method interfaces. One of its proverbs says that the bigger the interface, the weaker the abstraction."),
    bullet("**Dependency inversion:** the constructor in Spring and NestJS, `Depends` in FastAPI, a `NewService(repo)` function in Go. Four syntaxes for the same arrow."),

    h2("The invisible bites exactly where you cannot see it"),
    p("Recognizing the pattern is not trivia: it is what saves you the afternoon of debugging. The most baffling bugs in each framework live at the seam of the hidden pattern:"),
    bullet("**Spring:** you call a `@Transactional` method from another method of the same class and the transaction never opens. The internal call does not go through the proxy. If you know there is a Proxy, the mystery lasts a minute."),
    bullet("**NestJS:** a request-scoped provider spreads that scope to everything that injects it, and suddenly your supposed singletons are created on every request."),
    bullet("**FastAPI:** a dependency used twice in the same request runs only once, because its result is kept for that request. And a module-level “singleton” shares its state across tests."),
    bullet("**Go:** an interface holding a nil pointer is not equal to `nil`, and your `if err != nil` fires when you would swear it should not."),
    p("In all four cases the framework is not broken. It is applying a pattern you did not know was there."),

    h2("When to bring them into the open, and when not to"),
    quote("A pattern is the solution to a problem you already have, not to one you might have."),
    bullet("**Write it when the framework stops short.** Spring and NestJS solve the generic part; your business rules are not included."),
    bullet("**Wait for the third repetition.** Abstracting on the first usually produces the wrong abstraction."),
    bullet("**Use the cheapest version your language allows.** If a dictionary of functions solves the Strategy, do not build the class hierarchy out of nostalgia."),
    bullet("**Name it in code review.** Saying “this is an Adapter” saves three paragraphs of explanation."),
    p("Before introducing one I ask myself three questions: what concrete problem does it solve here, how much does change cost if I do not use it, and will whoever arrives in six months understand it without help?"),
    p("In my own work I use them where change really hurts: a Strategy so five insurance products share the same quoter in [Mi Seguro Liverpool](/en/projects/liverpool-seguros), and an Adapter so Stripe and an in-house gateway live behind the same interface in [PastPost](/en/projects/pastpost-social-network)."),
    p("Patterns are not a goal, and they are not an expired fashion. They are the language your frameworks are written in. You can work for years without speaking it, the same way you can live abroad without learning the language: it works, until the day you need to read the fine print."),
  ],
};

const posts = [
  { id: 'post-patrones-es', ...ES },
  { id: 'post-patrones-en', ...EN },
];

(async () => {
  console.log(posts.length, 'posts', APPLY ? '(APPLY)' : '(dry-run)');
  for (const x of posts) {
    console.log(' -', x.id, x.title, `(${x.body.length} blocks)`);
    if (APPLY) await client.patch(x.id).set({ title: x.title, excerpt: x.excerpt, body: x.body }).commit();
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
