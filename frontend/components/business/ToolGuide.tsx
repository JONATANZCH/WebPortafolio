'use client';

import { useState } from 'react';
import { SIZES, TOOL_CATEGORIES, type Size, type ToolMeta } from '@/lib/business/data';
import type { GuideText } from '@/lib/business/types';
import styles from './ToolGuide.module.css';

interface Props {
  text: GuideText;
  sizeNames: Record<Size, string>;
}

const W = 560;
const H = 330;
const M = { l: 92, r: 24, t: 18, b: 48 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;
const x = (ops: number) => M.l + ((ops - 0.5) / 5) * PW;
const y = (cost: number) => M.t + ((4.5 - cost) / 4) * PH;
const tier = (cost: number) => Math.min(4, Math.max(1, Math.round(cost)));

export default function ToolGuide({ text, sizeNames }: Props) {
  const [cat, setCat] = useState(TOOL_CATEGORIES[0].id);
  const [size, setSize] = useState<Size | 'all'>('all');
  const category = TOOL_CATEGORIES.find((c) => c.id === cat)!;
  const [selected, setSelected] = useState<string>(category.tools[0].id);
  const [hover, setHover] = useState<string | null>(null);

  const fits = (t: ToolMeta) => size === 'all' || t.sizes.includes(size);
  const current = category.tools.find((t) => t.id === selected) ?? category.tools[0];
  const info = text.tools[current.id];
  const hovered = hover ? category.tools.find((t) => t.id === hover) : null;
  const talent = category.axis === 'talent';
  const costAxis = talent ? text.talentAxis.costAxis : text.costAxis;
  const opsAxis = talent ? text.talentAxis.opsAxis : text.opsAxis;
  const costLabel = talent ? text.talentAxis.costLabel : text.costLabel;
  const opsLabel = talent ? text.talentAxis.opsLabel : text.opsLabel;

  const pickCat = (id: string) => {
    setCat(id);
    const first = TOOL_CATEGORIES.find((c) => c.id === id)!.tools[0];
    setSelected(first.id);
  };

  return (
    <div className={styles.guide}>
      <div className={styles.principles}>
        <h3 className={styles.blockTitle}>{text.principlesTitle}</h3>
        <ol className={styles.principleList}>
          {text.principles.map((p, i) => (
            <li key={p.title}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <strong>{p.title}</strong>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className={styles.blockTitle}>{text.bySizeTitle}</h3>
        <div className={styles.sizeCards}>
          {SIZES.map((s) => (
            <article key={s} className={styles.sizeCard}>
              <h4>{text.bySize[s].title}</h4>
              <dl>
                <dt>{text.focusLabel}</dt><dd>{text.bySize[s].focus}</dd>
                <dt>{text.stackLabel}</dt><dd>{text.bySize[s].stack}</dd>
                <dt>{text.avoidLabel}</dt><dd>{text.bySize[s].avoid}</dd>
              </dl>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.explorer}>
        <div className={styles.controls}>
          <div className={styles.tabs} role="group" aria-label={text.title}>
            {TOOL_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === cat}
                className={`${styles.tab} ${c.id === cat ? styles.tabOn : ''}`}
                onClick={() => pickCat(c.id)}
                data-umami-event="business-guide-category"
                data-umami-event-category={c.id}
              >
                {text.categories[c.id].name}
              </button>
            ))}
          </div>
          <div className={styles.sizeFilter} role="group" aria-label={text.sizeFilter}>
            <span>{text.sizeFilter}</span>
            {(['all', ...SIZES] as const).map((s) => (
              <button key={s} type="button" aria-pressed={size === s} className={`${styles.sizeBtn} ${size === s ? styles.sizeOn : ''}`} onClick={() => setSize(s)}>
                {s === 'all' ? text.allSizes : sizeNames[s]}
              </button>
            ))}
          </div>
        </div>

        <h3 className={styles.catQuestion}>{text.categories[cat].question}</h3>
        <p className={styles.catExplain} key={cat}>{text.categories[cat].explain}</p>

        <div className={styles.split}>
          <figure className={styles.chart}>
            <div className={styles.chartWrap}>
              <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-label={`${text.categories[cat].question} ${costAxis} / ${opsAxis}`}>
                {[1, 2, 3, 4].map((c) => (
                  <g key={c}>
                    <line x1={M.l} x2={W - M.r} y1={y(c)} y2={y(c)} className={styles.grid} />
                    <text x={M.l - 10} y={y(c) + 4} textAnchor="end" className={styles.tick}>
                      <tspan>{text.costTiers[c - 1].split(' ')[0]}</tspan>
                      <tspan className={styles.tierWord}> {text.costTiers[c - 1].split(' ').slice(1).join(' ')}</tspan>
                    </text>
                  </g>
                ))}
                <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} className={styles.baseline} />
                <text x={M.l} y={H - M.b + 18} className={styles.tick}>{text.low}</text>
                <text x={W - M.r} y={H - M.b + 18} textAnchor="end" className={styles.tick}>{text.high}</text>
                <text x={M.l + PW / 2} y={H - 8} textAnchor="middle" className={styles.axisTitle}>{opsAxis} →</text>

                {category.tools.map((t) => {
                  const cx = x(t.ops);
                  const cy = y(t.cost);
                  const right = t.ops > 4.1;
                  const isSel = t.id === current.id;
                  const ok = fits(t);
                  return (
                    <g
                      key={t.id}
                      className={`${styles.point} ${ok ? '' : styles.pointDim} ${isSel ? styles.pointSel : ''}`}
                      onClick={() => setSelected(t.id)}
                      onMouseEnter={() => setHover(t.id)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(t.id)}
                      onBlur={() => setHover(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(t.id); } }}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSel}
                      aria-label={`${text.tools[t.id].name}: ${text.costTiers[tier(t.cost) - 1]}, ${text.tools[t.id].costRange}`}
                    >
                      <circle cx={cx} cy={cy} r={22} className={styles.hit} />
                      {isSel && <circle cx={cx} cy={cy} r={14} className={styles.halo} />}
                      <circle cx={cx} cy={cy} r={isSel ? 9 : 7.5} className={styles.dot} />
                      <text x={right ? cx - 14 : cx + 14} y={cy + 4} textAnchor={right ? 'end' : 'start'} className={styles.pointLabel}>
                        {text.tools[t.id].name}
                      </text>
                    </g>
                  );
                })}
              </svg>
              {hovered && (
                <div className={styles.tip} style={{ left: `${(x(hovered.ops) / W) * 100}%`, top: `${(y(hovered.cost) / H) * 100}%` }} role="status">
                  <strong>{text.tools[hovered.id].name}</strong>
                  <span>{text.tools[hovered.id].costRange}</span>
                  {!fits(hovered) && size !== 'all' && <em>{text.notFit}</em>}
                </div>
              )}
              <span className={styles.yTitle} aria-hidden="true">↑ {costAxis}</span>
            </div>
            <figcaption className={styles.hint}>{text.chartHint}</figcaption>
          </figure>

          <article className={styles.detail} key={current.id} aria-live="polite">
            <p className={styles.examples}>{info.examples}</p>
            <h4>{info.name}</h4>
            {!fits(current) && size !== 'all' && <p className={styles.notFit}>{text.notFit}</p>}
            <dl className={styles.facts}>
              <div>
                <dt>{text.whenLabel}</dt>
                <dd>{info.when}</dd>
              </div>
              <div>
                <dt>{text.avoidToolLabel}</dt>
                <dd>{info.avoid}</dd>
              </div>
              <div>
                <dt>{costLabel}</dt>
                <dd><span className={styles.tier}>{text.costTiers[tier(current.cost) - 1]}</span> {info.costRange}</dd>
              </div>
              <div>
                <dt>{opsLabel}</dt>
                <dd>
                  <span className={styles.opsBar} aria-label={`${Math.round(current.ops)} / 5`}>
                    {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= Math.round(current.ops) ? styles.opsOn : ''} />)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>{text.fitsLabel}</dt>
                <dd className={styles.badges}>
                  {SIZES.map((s) => (
                    <span key={s} className={current.sizes.includes(s) ? styles.badgeOn : styles.badgeOff}>{sizeNames[s]}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <ul className={styles.options}>
          {category.tools.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className={`${styles.optionBtn} ${t.id === current.id ? styles.optionOn : ''} ${fits(t) ? '' : styles.optionDim}`}
                onClick={() => setSelected(t.id)}
                aria-pressed={t.id === current.id}
              >
                <span className={styles.optionName}>{text.tools[t.id].name}</span>
                <span className={styles.optionMeta}>{'$'.repeat(tier(t.cost))} · {opsLabel} {Math.round(t.ops)}/5</span>
              </button>
            </li>
          ))}
        </ul>

        <p className={styles.disclaimer}>{text.disclaimer}</p>
      </div>
    </div>
  );
}
