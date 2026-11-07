const fs = require('fs'), os = require('os'), path = require('path');
const { createClient } = require('@sanity/client');
const token = process.env.SANITY_TOKEN || JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
const client = createClient({ projectId: 'ohw2y3ub', dataset: 'production', apiVersion: '2024-01-01', useCdn: false, token });
(async () => {
  const docs = await client.fetch(`*[_type=="project" && language=="en" && "Microservicios" in stack]{_id, stack}`);
  for (const d of docs) {
    await client.patch(d._id).set({ stack: d.stack.map((s) => (s === 'Microservicios' ? 'Microservices' : s)) }).commit();
    console.log('fixed', d._id);
  }
})();
