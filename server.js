const express = require('express');
const { Client } = require('pg');
const app = express();

// Konfigurer EJS som malemotor
app.set('view engine', 'ejs');
app.use(express.static('public')); // For å vise bilder

// Koble til PostgreSQL-databasen
const client = new Client({
    connectionString: 'postgres://bruker:passord@localhost:5432/din_database'
});
client.connect();

// Hent data og vis i HTML
app.get('/', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM produkter');
        res.render('index', { produkter: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Feil ved henting av data');
    }
});

app.listen(3000, () => console.log('Server kjører på http://localhost:3000'));
