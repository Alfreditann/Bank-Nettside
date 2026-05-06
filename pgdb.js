const pg = require('pg');
require("dotenv").config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function initDB() {
    const client = await pool.connect();

    try {
        console.log("Connected to PostgreSQL database");

        await client.query(`
            CREATE TABLE IF NOT EXISTS test (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
            )
        `);

        const result = await client.query(`SELECT * FROM test ORDER BY id`);

        if (result.rows.length === 0) {
            await client.query(`INSERT INTO test (name) VALUES ($1)`, ["Test row"]);
        }

        const rows = await client.query(`SELECT * FROM test ORDER BY id`);
        console.table(rows.rows);
    } catch (err) {
        console.error("Error initializing PostgreSQL database:", err);
        process.exit(1);
    } finally {
        client.release();
    }
}

initDB();

module.exports = { pool, initDB };
