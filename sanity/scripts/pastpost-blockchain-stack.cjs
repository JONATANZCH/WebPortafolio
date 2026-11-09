const fs = require('fs'), os = require('os'), path = require('path');
const { createClient } = require('@sanity/client');
const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });
// Only what the PastPost case already states: Ethereum, Solidity, EVM-compatible smart contracts.
const ADD = ['Blockchain', 'Smart contracts', 'EVM'];
(async () => {
  const docs = await client.fetch('*[_type=="project" && slug.current=="pastpost-social-network"]{_id, language, stack}');
  for (const d of docs) {
    await client.patch(d._id).set({ stack: [...new Set([...(d.stack || []), ...ADD])] }).commit();
    console.log('updated', d.language);
  }
})();
