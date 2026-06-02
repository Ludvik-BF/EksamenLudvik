const { Client } = require('pg');
const c = new Client({ user: 'postgres', password: 'Lykke26!', host: 'localhost', port: 5432, database: 'postgres' });
c.connect()
  .then(() => c.query("select current_database() as db, version() as ver, exists(select 1 from pg_database where datname='produkter_db') as has_db"))
  .then(r => { console.log(JSON.stringify(r.rows, null, 2)); return c.end(); })
  .catch(e => { console.error(e); c.end(); });
