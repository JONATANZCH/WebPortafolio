const { createClient } = require('@sanity/client');
const c = createClient({ projectId:'ohw2y3ub', dataset:'production', apiVersion:'2024-01-01', useCdn:false, token:process.env.SANITY_TOKEN });
c.fetch('*[language == "en"] | order(_type asc) { _id, _type, language, title, role, degree, author, fullName }').then(docs => {
  console.log('English docs:', docs.length);
  docs.forEach(d => console.log(d._type, '|', d._id.slice(0,8), '|', (d.title||d.role||d.degree||d.author||d.fullName||'').slice(0,60)));
}).catch(e => { console.error(e.message); process.exit(1); });
