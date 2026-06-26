const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'ohw2y3ub',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

async function run() {
  const docs = await client.fetch(`*[language == "es"] | order(_type asc)`);
  console.log(JSON.stringify(docs, null, 2));
}

run().catch(err => { console.error(err.message); process.exit(1); });
