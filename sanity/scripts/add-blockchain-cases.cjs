/**
 * Añade la decisión "pólizas verificables con Ethereum" al caso de PastPost y marca el uso de
 * blockchain en Mi Seguro Liverpool. BORRADOR: revisa el texto antes de dejarlo público.
 * Uso: node scripts/add-blockchain-cases.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

const DECISION = {
  es: {
    title: 'Pólizas verificables en Ethereum',
    body:
      'Cada póliza se acuña como un token no fungible en Ethereum. En la cadena guardo solo una huella criptográfica del documento y metadatos mínimos, nunca datos personales: el archivo y la información sensible viven en la base de datos y el almacenamiento de la plataforma. ' +
      'Elegí blockchain porque una póliza debe poder demostrarse: que existe, desde cuándo y que no fue alterada, incluso si la plataforma desapareciera o fuera cuestionada. Un registro en una base de datos lo controla quien administra el sistema; uno en Ethereum lo puede verificar cualquiera sin confiar en nosotros. ' +
      'Elegí Ethereum por su seguridad y descentralización, por el ecosistema más maduro (Solidity, estándares de tokens y contratos auditados como los de OpenZeppelin) y porque es compatible con EVM, lo que permite migrar a una red de segunda capa si el costo de gas lo exigiera. ' +
      'A cambio asumo costos por transacción, la inmutabilidad (un error no se corrige, por eso se prueba primero en redes de prueba) y la complejidad de mantener coherentes los datos de dentro y fuera de la cadena.',
    principles: ['Ethereum', 'Solidity', 'Tokens no fungibles', 'Privacidad por diseño', 'Datos fuera de la cadena'],
  },
  en: {
    title: 'Verifiable policies on Ethereum',
    body:
      'Each policy is minted as a non-fungible token on Ethereum. On-chain I store only a cryptographic fingerprint of the document and minimal metadata, never personal data: the file and sensitive information live in the platform’s database and storage. ' +
      'I chose blockchain because a policy must be provable: that it exists, since when, and that it was not altered, even if the platform disappeared or were challenged. A database record is controlled by whoever runs the system; an Ethereum record can be verified by anyone without trusting us. ' +
      'I chose Ethereum for its security and decentralization, for the most mature ecosystem (Solidity, token standards and audited contracts such as OpenZeppelin’s) and because it is EVM-compatible, which allows moving to a layer-2 network if gas cost demanded it. ' +
      'In exchange I accept per-transaction costs, immutability (a mistake cannot be fixed, so it is tested on test networks first) and the complexity of keeping on-chain and off-chain data consistent.',
    principles: ['Ethereum', 'Solidity', 'Non-fungible tokens', 'Privacy by design', 'Off-chain data'],
  },
};

(async () => {
  const docs = await client.fetch('*[_type=="project" && slug.current in ["pastpost-social-network","liverpool-seguros"]]{_id, language, "slug": slug.current, stack, "decisions": caseStudy.decisions}');
  for (const d of docs) {
    const lang = d.language === 'en' ? 'en' : 'es';
    if (d.slug === 'pastpost-social-network') {
      const decisions = d.decisions || [];
      if (!decisions.some((x) => x.title === DECISION[lang].title)) {
        decisions.push({ _key: 'blockchain-policies', _type: 'decision', ...DECISION[lang] });
      }
      const stack = [...new Set([...(d.stack || []), 'Ethereum', 'Solidity'])];
      await client.patch(d._id).set({ 'caseStudy.decisions': decisions, stack }).commit();
    } else {
      const stack = [...new Set([...(d.stack || []), 'Blockchain'])];
      await client.patch(d._id).set({ stack }).commit();
    }
    console.log('updated', d.slug, d.language);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
