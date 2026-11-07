/**
 * Banco de pruebas de seguridad del formulario de contacto.
 * Usa el código real compilado (dist/) con el ContactService sustituido por un
 * doble: no toca base de datos, no envía correos y no hace llamadas externas.
 *
 * Uso: npm run build && node scripts/security-check.mjs
 */
import 'reflect-metadata';
import { NestFactory, APP_GUARD } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import helmet from 'helmet';
import { ContactController } from '../dist/contact/contact.controller.js';
import { ContactService } from '../dist/contact/contact.service.js';
import http from 'node:http';
import { ResendProvider } from '../dist/email/resend.provider.js';
import { createEmailProvider } from '../dist/email/email.factory.js';

const saved = [];
const fakeService = {
  createContact: async (dto) => {
    saved.push(dto);
    return { success: true, messageId: 'test-id' };
  },
};

// Same wiring as AppModule: global throttler guard + the contact controller.
class TestModule {}
Module({
  imports: [ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 100 }] })],
  controllers: [ContactController],
  providers: [
    { provide: ContactService, useValue: fakeService },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})(TestModule);

const app = await NestFactory.create(TestModule, { logger: false });
app.use(helmet());
app.useGlobalPipes(
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
);
// Behind API Gateway the real client IP comes from X-Forwarded-For (same setting as main.ts / lambda.ts).
app.getHttpAdapter().getInstance().set('trust proxy', 1);
await app.listen(0);
const base = `http://127.0.0.1:${app.getHttpServer().address().port}`;

const valid = { name: 'Test User', email: 'test@example.com', subject: 'Prueba de seguridad', message: 'Mensaje de prueba con más de diez caracteres.' };
// Every test case gets its own client IP so the per-route rate limit does not mask other checks.
let ipCounter = 10;
const post = (body, headers = {}) =>
  fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': headers.ip ?? `10.0.0.${ipCounter++}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

let r = await post({ ...valid });
check('Mensaje válido → 200', r.status === 200, `status ${r.status}`);

r = await post({ ...valid, email: 'no-es-un-correo' });
check('Correo inválido → 400', r.status === 400, `status ${r.status}`);

r = await post({ name: '', email: valid.email, subject: 'x', message: 'corto' });
check('Campos vacíos o cortos → 400', r.status === 400, `status ${r.status}`);

r = await post({ ...valid, isAdmin: true, role: 'admin' });
check('Campos extra no permitidos (mass assignment) → 400', r.status === 400, `status ${r.status}`);

r = await post({ ...valid, message: 'a'.repeat(5001) });
check('Mensaje de 5001 caracteres → 400', r.status === 400, `status ${r.status}`);

r = await post({ ...valid, name: { $ne: null } });
check('Objeto en lugar de texto (inyección NoSQL) → 400', r.status === 400, `status ${r.status}`);

r = await post('{"name": "roto"');
check('JSON malformado → 400', r.status === 400, `status ${r.status}`);

const before = saved.length;
r = await post({ ...valid, website: 'http://spam.example' });
check('Honeypot lleno → 200 sin guardar nada', r.status === 200 && saved.length === before, `status ${r.status}, guardados ${saved.length - before}`);

r = await post({ ...valid, message: 'x'.repeat(200 * 1024) });
check('Cuerpo de 200 KB → rechazado (413)', r.status === 413, `status ${r.status}`);

r = await fetch(`${base}/api/contact`);
check('GET no permitido → 404', r.status === 404, `status ${r.status}`);

r = await post({ ...valid });
check('Cabecera X-Powered-By ausente', r.headers.get('x-powered-by') === null);
check('Cabeceras de seguridad (helmet) presentes', Boolean(r.headers.get('x-content-type-options')) && Boolean(r.headers.get('strict-transport-security')));

// Rate limit: the route allows 5 per minute. Some were already used above.
const statuses = [];
for (let i = 0; i < 8; i++) statuses.push((await post({ ...valid }, { ip: '10.9.9.9' })).status);
check('Límite de frecuencia: 5 por minuto y luego 429', statuses.slice(0, 5).every((x) => x === 200) && statuses.slice(5).every((x) => x === 429), `estados: ${statuses.join(', ')}`);

await app.close();

// Email template escaping (real service code, no network)
const Service = ContactService;
const stub = Object.create(Service.prototype);
stub.i18nService = { getEmailMessage: (k) => k };
const html = stub.buildEmailHtml(
  { id: 'id', name: '<script>alert(1)</script>', email: 'a"onmouseover="x@e.com', subject: '<img src=x onerror=alert(1)>', message: '<b>hola</b>', createdAt: new Date() },
  'es',
);
check('Plantilla de correo escapa HTML del usuario', !html.includes('<script>alert(1)</script>') && !html.includes('<img src=x') && !html.includes('<b>hola</b>') && html.includes('&lt;script&gt;'));

// Email provider layer: request shape (local fake API, nothing leaves this machine)
let captured;
const fake = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    captured = { url: req.url, auth: req.headers.authorization, body: JSON.parse(body) };
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{"id":"stub"}');
  });
});
await new Promise((r) => fake.listen(0, '127.0.0.1', r));
const resend = new ResendProvider('re_test_key', `http://127.0.0.1:${fake.address().port}`);
await resend.send({
  from: { email: 'onboarding@resend.dev', name: 'Portfolio Contact Form' },
  to: 'yo@example.com',
  replyTo: { email: 'cliente@example.com', name: 'Cliente <b>' },
  subject: 'Asunto',
  html: '<p>hola</p>',
});
fake.close();
check('Resend: POST /emails con clave Bearer', captured?.url === '/emails' && captured?.auth === 'Bearer re_test_key');
check(
  'Resend: remitente, destinatario y reply_to correctos y sin HTML',
  captured?.body.from === 'Portfolio Contact Form <onboarding@resend.dev>' &&
    captured?.body.to[0] === 'yo@example.com' &&
    captured?.body.reply_to.includes('cliente@example.com') &&
    !captured?.body.reply_to.includes('<b>'),
);
check(
  'Selección de proveedor por variables de entorno',
  createEmailProvider({ RESEND_API_KEY: 'x' }).provider?.name === 'resend' &&
    createEmailProvider({ SENDGRID_API_KEY: 'x' }).provider?.name === 'sendgrid' &&
    createEmailProvider({ EMAIL_PROVIDER: 'resend' }).missing.length === 1 &&
    createEmailProvider({}).missing.length === 1,
);

console.log('\nResultado de la revisión de seguridad del formulario\n');
for (const x of results) console.log(`${x.ok ? 'OK  ' : 'FALLA'}  ${x.name}${x.detail ? `  (${x.detail})` : ''}`);
const failed = results.filter((x) => !x.ok).length;
await new Promise((res) => setTimeout(res, 300));
console.log(`\n${results.length - failed}/${results.length} comprobaciones superadas`);
process.exit(failed ? 1 : 0);
