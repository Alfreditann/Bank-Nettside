const pg = require("pg");
require("dotenv").config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

// --------------------
// INIT DB (SAFE)
// --------------------
async function initDB() {
    const client = await pool.connect();

    try {
        console.log("Connected to PostgreSQL database");

        // USERS table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `);

        // BANK ACCOUNTS table
        await client.query(`
            CREATE TABLE IF NOT EXISTS bank_accounts (
                id SERIAL PRIMARY KEY,
                account_name VARCHAR(50) NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                balance INTEGER NOT NULL DEFAULT 0
            );
        `);

        console.log("Postgres schema ready");
    } catch (err) {
        console.error("Error initializing PostgreSQL database:", err);
        throw err;
    } finally {
        client.release();
    }
}

// --------------------
// USERS
// --------------------
async function registerUser(user) {
    const res = await pool.query(
        `INSERT INTO users (name, username, password)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user.name, user.username, user.password]
    );
    return res.rows[0];
}

async function getUser(username) {
    const res = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    );
    return res.rows[0] || null;
}

async function getUserById(id) {
    const res = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    );
    return res.rows[0] || null;
}

// --------------------
// ACCOUNTS
// --------------------
async function makeAccount({ accountName, balance = 0, userId }) {
    const normalizedAccountName = String(accountName || "").trim();

    if (!normalizedAccountName) {
        throw new Error("Account name is required");
    }

    const res = await pool.query(
        `INSERT INTO bank_accounts (account_name, balance, user_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [normalizedAccountName, Number(balance) || 0, userId]
    );
    return res.rows[0];
}

async function getUserAccounts(userId) {
    const res = await pool.query(
        `SELECT id, account_name, balance
         FROM bank_accounts
         WHERE user_id = $1`,
        [userId]
    );
    return res.rows;
}

// --------------------
// TRANSFER MONEY (SAFE)
// --------------------
async function transferMoney({ fromAccount, toAccount, amount }) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const withdraw = await client.query(
            `UPDATE bank_accounts
             SET balance = balance - $1
             WHERE account_name = $2 AND balance >= $1
             RETURNING id`,
            [amount, fromAccount]
        );

        if (withdraw.rowCount === 0) {
            throw new Error("Insufficient funds or source account not found");
        }

        const deposit = await client.query(
            `UPDATE bank_accounts
             SET balance = balance + $1
             WHERE account_name = $2
             RETURNING id`,
            [amount, toAccount]
        );

        if (deposit.rowCount === 0) {
            throw new Error("Destination account not found");
        }

        await client.query("COMMIT");
        return true;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

// --------------------
// INIT (IMPORTANT FIX)
// --------------------
initDB().catch(err => {
    console.error("Fatal DB init error:", err);
    process.exit(1);
});

module.exports = {
    pool,
    initDB,
    registerUser,
    getUser,
    getUserById,
    makeAccount,
    getUserAccounts,
    transferMoney
};