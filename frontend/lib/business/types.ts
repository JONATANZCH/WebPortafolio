import type { AreaId, Attr, Bucket, InsightId, PresetId, Size } from './data';

export interface Advice { low: string; mid: string; high: string }

export interface DiagnosticText {
  eyebrow: string;
  title: string;
  subtitle: string;
  sizeQuestion: string;
  sizes: Record<Size, { label: string; range: string; notYet: string }>;
  questions: { text: string; options: [string, string, string, string] }[];
  areas: Record<AreaId, { name: string; advice: Advice }>;
  stages: { title: string; text: string }[];
  progress: string;
  back: string;
  restart: string;
  changeSize: string;
  legendCurrent: string;
  legendTarget: string;
  chartTitle: string;
  chartHint: string;
  resultTitle: string;
  stageLabel: string;
  priorities: string;
  gapLabel: string;
  notYetTitle: string;
  scoresTitle: string;
  scoreCurrent: string;
  scoreTarget: string;
  cta: string;
  note: string;
}

export interface QualityText {
  eyebrow: string;
  title: string;
  subtitle: string;
  buckets: Record<Bucket, { label: string; hint: string }>;
  attrs: Record<Attr, { name: string; definition: string; metric: string }>;
  presetsLabel: string;
  presets: Record<PresetId, string>;
  presetNotes: Record<PresetId, string>;
  presetWhy: string;
  reset: string;
  tensions: Record<string, string>;
  tensionsTitle: string;
  conflict: string;
  decided: string;
  noTensions: string;
  insightsTitle: string;
  insights: Record<InsightId, { title: string; text: string }>;
  diagramHint: string;
  metricLabel: string;
  counter: string;
}

export interface ToolText {
  name: string;
  examples: string;
  when: string;
  avoid: string;
  costRange: string;
}

export interface GuideText {
  eyebrow: string;
  title: string;
  subtitle: string;
  principlesTitle: string;
  principles: { title: string; text: string }[];
  bySizeTitle: string;
  bySize: Record<Size, { title: string; focus: string; stack: string; avoid: string }>;
  focusLabel: string;
  stackLabel: string;
  avoidLabel: string;
  sizeFilter: string;
  allSizes: string;
  categories: Record<string, { name: string; question: string; explain: string }>;
  talentAxis: { costAxis: string; opsAxis: string; costLabel: string; opsLabel: string };
  tools: Record<string, ToolText>;
  costAxis: string;
  opsAxis: string;
  low: string;
  high: string;
  costTiers: [string, string, string, string];
  whenLabel: string;
  avoidToolLabel: string;
  costLabel: string;
  opsLabel: string;
  fitsLabel: string;
  notFit: string;
  disclaimer: string;
  chartHint: string;
}

export interface BusinessContent {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string; primary: string; secondary: string; jump: string[] };
  diagnostic: DiagnosticText;
  quality: QualityText;
  guide: GuideText;
  sizeNames: Record<Size, string>;
  engagement: { eyebrow: string; title: string; subtitle: string; steps: { title: string; text: string }[] };
  closing: { title: string; text: string; calendly: string; contact: string };
}
