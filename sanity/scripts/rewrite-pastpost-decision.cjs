/**
 * Reescribe la decisión de Ethereum del caso de PastPost con un tono más directo.
 * Uso: node scripts/rewrite-pastpost-decision.cjs
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createClient } = require('@sanity/client');

const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });

const BODY = {
  es:
    'Las pólizas se acuñan como tokens no fungibles en Ethereum. En la cadena solo registro la huella criptográfica del documento y metadatos mínimos; el archivo y los datos personales se quedan fuera, en la base de datos y el almacenamiento de la plataforma.\n\n' +
    'La razón de fondo es de confianza. Una póliza tiene que poder demostrarse (que existe, desde cuándo y que nadie la alteró) aunque la plataforma cambie de manos o desaparezca. Un registro en nuestra base de datos depende de quien la opera; uno en Ethereum lo puede verificar cualquiera, de forma independiente.\n\n' +
    'Elegí Ethereum por su seguridad y descentralización, por la madurez de su ecosistema (Solidity, estándares de tokens, contratos auditados de OpenZeppelin) y porque la compatibilidad con EVM deja abierta una migración a una red de segunda capa si el costo del gas lo justifica.\n\n' +
    'El precio de la decisión: una tarifa por transacción, la inmutabilidad (un error no se corrige, así que todo pasa antes por redes de prueba) y el esfuerzo de mantener coherentes los datos de dentro y fuera de la cadena.',
  en:
    'Policies are minted as non-fungible tokens on Ethereum. On-chain I record only the document’s cryptographic fingerprint and minimal metadata; the file and personal data stay off-chain, in the platform’s database and storage.\n\n' +
    'The underlying reason is trust. A policy has to be provable (that it exists, since when, and that nobody altered it) even if the platform changes hands or disappears. A record in our database depends on whoever runs it; one on Ethereum can be verified by anyone, independently.\n\n' +
    'I chose Ethereum for its security and decentralization, for the maturity of its ecosystem (Solidity, token standards, audited OpenZeppelin contracts) and because EVM compatibility keeps a move to a layer-2 network open if gas cost justifies it.\n\n' +
    'The price of the decision: a fee per transaction, immutability (a mistake cannot be fixed, so everything goes through test networks first) and the effort of keeping on-chain and off-chain data consistent.',
};

(async () => {
  const docs = await client.fetch('*[_type=="project" && slug.current=="pastpost-social-network"]{_id, language, "decisions": caseStudy.decisions}');
  for (const d of docs) {
    const lang = d.language === 'en' ? 'en' : 'es';
    const decisions = (d.decisions || []).map((x) => (x._key === 'blockchain-policies' ? { ...x, body: BODY[lang] } : x));
    await client.patch(d._id).set({ 'caseStudy.decisions': decisions }).commit();
    console.log('updated', d._id, lang);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
