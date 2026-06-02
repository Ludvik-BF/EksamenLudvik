const express = require('express');
const path = require('path');
const { Client } = require('pg');
const app = express();

app.use(express.static(path.join(__dirname, '../Nettsiden')));
app.use(express.json());

// Postgres client using env vars
const client = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'produkter_db'
});

async function initDb() {
  await client.connect();
  // ensure kategori column exists (minimal migration)
  await client.query("ALTER TABLE produkter ADD COLUMN IF NOT EXISTS kategori VARCHAR(50);");
}

initDb().catch(err => {
  console.error('DB init feil:', err.message || err);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Nettsiden/index.html'));
});

// Minimal CRUD API for produkter
app.get('/api/produkter', async (req, res) => {
  const { kategori } = req.query;
  try {
    const q = kategori ? 'SELECT * FROM produkter WHERE kategori = $1 ORDER BY produkt_id' : 'SELECT * FROM produkter ORDER BY produkt_id';
    const params = kategori ? [kategori] : [];
    const result = await client.query(q, params);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/produkter/:id', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM produkter WHERE produkt_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ikke funnet' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/produkter', async (req, res) => {
  const { navn, beskrivelse, pris, bilde_url, kategori } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO produkter (navn, beskrivelse, pris, bilde_url, kategori) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [navn, beskrivelse, pris, bilde_url, kategori]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/produkter/:id', async (req, res) => {
  const { navn, beskrivelse, pris, bilde_url, kategori } = req.body;
  try {
    const result = await client.query(
      'UPDATE produkter SET navn=$1, beskrivelse=$2, pris=$3, bilde_url=$4, kategori=$5 WHERE produkt_id=$6 RETURNING *',
      [navn, beskrivelse, pris, bilde_url, kategori, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ikke funnet' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/produkter/:id', async (req, res) => {
  try {
    await client.query('DELETE FROM produkter WHERE produkt_id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});
