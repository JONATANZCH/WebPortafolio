// Datos numéricos y estructura compartida entre idiomas para la página "Para empresas".
// Los textos viven en es.ts / en.ts, indexados por los mismos ids.

export type Size = 's' | 'm' | 'l';
export const SIZES: Size[] = ['s', 'm', 'l'];

// ─── Diagnóstico ───
export type AreaId = 'auto' | 'data' | 'cloud' | 'security' | 'delivery';
export const AREAS: AreaId[] = ['auto', 'data', 'cloud', 'security', 'delivery'];

/** Área que mide cada pregunta, en orden. La respuesta vale 0..3 según su posición. */
export const QUESTION_AREAS: AreaId[] = ['auto', 'auto', 'data', 'data', 'cloud', 'cloud', 'security', 'security', 'delivery', 'delivery'];

/** Madurez recomendada (0-100) por tamaño: lo razonable a exigir, no el máximo posible. */
export const TARGETS: Record<Size, Record<AreaId, number>> = {
  s: { auto: 60, data: 40, cloud: 45, security: 65, delivery: 55 },
  m: { auto: 75, data: 65, cloud: 70, security: 80, delivery: 75 },
  l: { auto: 85, data: 80, cloud: 85, security: 90, delivery: 85 },
};

/** Umbrales de etapa sobre el promedio general (0-100). */
export const STAGE_THRESHOLDS = [0, 35, 60, 80];

// ─── Atributos de calidad ───
export type Attr = 'performance' | 'availability' | 'scalability' | 'maintainability' | 'security' | 'consistency' | 'cost';
export const ATTRS: Attr[] = ['performance', 'availability', 'scalability', 'maintainability', 'security', 'consistency', 'cost'];
export type Bucket = 'must' | 'enough' | 'flex';
export const BUCKETS: Bucket[] = ['must', 'enough', 'flex'];
export const MAX_MUST = 3;

/** Pares en tensión: mejorar uno suele empeorar el otro. */
export const TENSIONS: [Attr, Attr][] = [
  ['availability', 'consistency'],
  ['performance', 'cost'],
  ['availability', 'cost'],
  ['scalability', 'consistency'],
  ['security', 'performance'],
  ['scalability', 'maintainability'],
  ['performance', 'maintainability'],
  ['consistency', 'performance'],
  ['security', 'cost'],
];

export type PresetId = 'fintech' | 'ecommerce' | 'saas' | 'health' | 'media' | 'ai' | 'startup' | 'internal';
export const PRESETS: Record<PresetId, Record<Attr, Bucket>> = {
  fintech: { security: 'must', consistency: 'must', availability: 'must', maintainability: 'enough', performance: 'enough', scalability: 'flex', cost: 'flex' },
  ecommerce: { availability: 'must', scalability: 'must', security: 'must', performance: 'enough', maintainability: 'enough', consistency: 'flex', cost: 'flex' },
  startup: { cost: 'must', maintainability: 'must', security: 'enough', performance: 'enough', availability: 'enough', scalability: 'flex', consistency: 'flex' },
  saas: { security: 'must', availability: 'must', maintainability: 'must', scalability: 'enough', performance: 'enough', consistency: 'enough', cost: 'flex' },
  health: { security: 'must', consistency: 'must', availability: 'enough', maintainability: 'enough', performance: 'enough', cost: 'enough', scalability: 'flex' },
  media: { performance: 'must', availability: 'must', scalability: 'must', security: 'enough', maintainability: 'enough', cost: 'enough', consistency: 'flex' },
  ai: { cost: 'must', security: 'must', performance: 'enough', maintainability: 'enough', availability: 'enough', scalability: 'flex', consistency: 'flex' },
  internal: { security: 'must', maintainability: 'must', consistency: 'enough', availability: 'enough', cost: 'enough', performance: 'flex', scalability: 'flex' },
};

export type InsightId =
  | 'tooMany' | 'none' | 'secFlex'
  | 'availConsConflict' | 'availEventual' | 'consStrong'
  | 'costAvailConflict' | 'costScale'
  | 'perfMust' | 'secMust' | 'maintMust' | 'scalOverMaint'
  | 'costFlex' | 'consFlex';

export function insightsFor(sel: Record<Attr, Bucket>): InsightId[] {
  const is = (a: Attr, b: Bucket) => sel[a] === b;
  const must = ATTRS.filter((a) => is(a, 'must')).length;
  const out: InsightId[] = [];
  if (must > MAX_MUST) out.push('tooMany');
  if (must === 0) out.push('none');
  if (is('security', 'flex')) out.push('secFlex');
  if (is('availability', 'must') && is('consistency', 'must')) out.push('availConsConflict');
  else if (is('availability', 'must') && is('consistency', 'flex')) out.push('availEventual');
  else if (is('consistency', 'must') && is('availability', 'flex')) out.push('consStrong');
  if (is('cost', 'must') && is('availability', 'must')) out.push('costAvailConflict');
  if (is('cost', 'must') && is('scalability', 'must')) out.push('costScale');
  if (is('performance', 'must')) out.push('perfMust');
  if (is('security', 'must')) out.push('secMust');
  if (is('maintainability', 'must')) out.push('maintMust');
  if (is('scalability', 'must') && is('maintainability', 'flex')) out.push('scalOverMaint');
  if (is('cost', 'flex')) out.push('costFlex');
  if (is('consistency', 'flex') && !out.includes('availEventual')) out.push('consFlex');
  return out;
}

// ─── Guía de herramientas ───
export interface ToolMeta {
  id: string;
  sizes: Size[];
  /** Costo relativo 1 (bajo) a 4 (muy alto). */
  cost: number;
  /** Esfuerzo de operación 1 (bajo) a 5 (alto). */
  ops: number;
}
/** 'infra': costo mensual de infraestructura y esfuerzo de operación. 'talent': costo del equipo y curva de aprendizaje. */
export interface CategoryMeta { id: string; axis?: 'infra' | 'talent'; tools: ToolMeta[] }

export const TOOL_CATEGORIES: CategoryMeta[] = [
  { id: 'compute', tools: [
    { id: 'paas', sizes: ['s', 'm'], cost: 1, ops: 1 },
    { id: 'serverless', sizes: ['s', 'm', 'l'], cost: 1.4, ops: 2 },
    { id: 'containers', sizes: ['m', 'l'], cost: 2.2, ops: 2.6 },
    { id: 'vms', sizes: ['s', 'm', 'l'], cost: 1.8, ops: 3.6 },
    { id: 'kubernetes', sizes: ['l'], cost: 3.4, ops: 4.6 },
  ] },
  { id: 'architecture', tools: [
    { id: 'modular', sizes: ['s', 'm', 'l'], cost: 1, ops: 1.2 },
    { id: 'events', sizes: ['m', 'l'], cost: 2, ops: 3 },
    { id: 'micro', sizes: ['m', 'l'], cost: 3.2, ops: 4.4 },
  ] },
  { id: 'backend', axis: 'talent', tools: [
    { id: 'python', sizes: ['s', 'm', 'l'], cost: 1.2, ops: 1.6 },
    { id: 'nestjs', sizes: ['s', 'm', 'l'], cost: 1.6, ops: 2.4 },
    { id: 'dotnet', sizes: ['m', 'l'], cost: 2.3, ops: 2.8 },
    { id: 'java', sizes: ['m', 'l'], cost: 2.7, ops: 3.4 },
    { id: 'go', sizes: ['m', 'l'], cost: 3.2, ops: 3.8 },
  ] },
  { id: 'frontend', axis: 'talent', tools: [
    { id: 'spa', sizes: ['s', 'm', 'l'], cost: 1.2, ops: 1.4 },
    { id: 'nextjs', sizes: ['s', 'm', 'l'], cost: 1.6, ops: 2.4 },
    { id: 'flutter', sizes: ['s', 'm', 'l'], cost: 2.2, ops: 2.6 },
    { id: 'rn', sizes: ['s', 'm', 'l'], cost: 1.8, ops: 3.3 },
    { id: 'mobileNative', sizes: ['m', 'l'], cost: 3.4, ops: 4 },
  ] },
  { id: 'messaging', tools: [
    { id: 'sqs', sizes: ['s', 'm', 'l'], cost: 1, ops: 1 },
    { id: 'eventbridge', sizes: ['m', 'l'], cost: 1.3, ops: 1.8 },
    { id: 'rabbit', sizes: ['m', 'l'], cost: 2, ops: 3.2 },
    { id: 'kafka', sizes: ['l'], cost: 3.4, ops: 4.6 },
  ] },
  { id: 'data', tools: [
    { id: 'postgres', sizes: ['s', 'm', 'l'], cost: 1.5, ops: 2 },
    { id: 'redis', sizes: ['s', 'm', 'l'], cost: 1, ops: 1.4 },
    { id: 'dynamo', sizes: ['m', 'l'], cost: 2, ops: 1.2 },
    { id: 'mongo', sizes: ['s', 'm', 'l'], cost: 2.1, ops: 2.6 },
    { id: 'warehouse', sizes: ['m', 'l'], cost: 3, ops: 3.2 },
  ] },
  { id: 'ai', tools: [
    { id: 'rules', sizes: ['s', 'm', 'l'], cost: 1, ops: 1 },
    { id: 'llmapi', sizes: ['s', 'm', 'l'], cost: 2, ops: 1.6 },
    { id: 'rag', sizes: ['m', 'l'], cost: 2.4, ops: 3 },
    { id: 'agents', sizes: ['m', 'l'], cost: 3.1, ops: 4 },
    { id: 'finetune', sizes: ['l'], cost: 3.6, ops: 4.6 },
  ] },
  { id: 'automation', tools: [
    { id: 'lowcode', sizes: ['s', 'm'], cost: 1.5, ops: 1 },
    { id: 'scripts', sizes: ['s', 'm'], cost: 1, ops: 2.2 },
    { id: 'orchestrator', sizes: ['m', 'l'], cost: 2, ops: 3 },
    { id: 'rpa', sizes: ['m', 'l'], cost: 3.2, ops: 3.8 },
  ] },
  { id: 'identity', tools: [
    { id: 'psp', sizes: ['s', 'm', 'l'], cost: 2.4, ops: 1 },
    { id: 'auth0', sizes: ['s', 'm', 'l'], cost: 2, ops: 1.4 },
    { id: 'cognito', sizes: ['s', 'm', 'l'], cost: 1, ops: 2.2 },
    { id: 'keycloak', sizes: ['m', 'l'], cost: 1.8, ops: 4 },
    { id: 'gateway', sizes: ['l'], cost: 4, ops: 5 },
  ] },
  { id: 'observability', tools: [
    { id: 'native', sizes: ['s', 'm', 'l'], cost: 1, ops: 1.6 },
    { id: 'saas', sizes: ['m', 'l'], cost: 3.4, ops: 1 },
    { id: 'oss', sizes: ['m', 'l'], cost: 1.8, ops: 3.4 },
  ] },
];

/** Reemplaza {clave} en un texto. */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
