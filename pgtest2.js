const { Client } = require('pg');
const tests = [ {host:'localhost',db:'postgres'}, {host:'127.0.0.1',db:'postgres'}, {host:'::1',db:'postgres'} ];
(async ()=>{
 for (const t of tests) {
  const c = new Client({ user: 'postgres', password:'Lykke26!', host:t.host, port:5432, database:t.db });
  try {
    await c.connect();
    const r = await c.query("select inet_client_addr() as client_ip, inet_server_addr() as server_ip, current_database() as db, version() as ver, exists(select 1 from pg_database where datname='produkter_db') as has_db");
    console.log('host='+t.host, JSON.stringify(r.rows,null,2));
  } catch(e) {
    console.error('host='+t.host, e.message);
  }
  await c.end();
 }
})();
