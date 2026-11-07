const COVERS = new Set([
  'ia-cambio-paradigma-developers',
  'sindrome-impostor-tech',
  'aws-vpc-explicado-simple',
  'libertad-autonomia-trabajo',
  'blockchain-para-desarrolladores',
  'sobreviviendo-microgestion',
]);

/** Illustration shipped in /public/blog for a post slug, if there is one. */
export function coverFor(slug?: string): string | null {
  return slug && COVERS.has(slug) ? `/blog/${slug}.svg` : null;
}
