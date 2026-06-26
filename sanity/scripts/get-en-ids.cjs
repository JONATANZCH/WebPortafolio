const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'ohw2y3ub', dataset: 'production',
  apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_TOKEN,
});

async function run() {
  const docs = await client.fetch(
    `*[_type in ["about","experience","education","project","testimonial","post"]] | order(_type asc, _createdAt asc) { _id, _type, _createdAt, language, title, "name": coalesce(author, company, school, fullName, title) }`,
  );
  for (const d of docs) {
    console.log(`${d._type} | ${d.language} | ${d._id} | ${d._createdAt.slice(0,16)} | ${d.name || d.title || ''}`);
  }
}

run().catch(err => { console.error(err.message); process.exit(1); });
