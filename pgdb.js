const pg = require('pg');
require("dotenv").config();
const crypto = require("crypto");


const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Initialize database schema
async function initDB() {
    const client = await pool.connect();

    try {
        console.log("Connected to PostgreSQL database");

        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                username VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `);

        // Create bankAccounts table with foreign key to users
        await client.query(`
            CREATE TABLE IF NOT EXISTS bankAccounts (
                id SERIAL PRIMARY KEY,
                accountId BIGINT,
                Aname VARCHAR(50) NOT NULL,
                userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                balance INTEGER NOT NULL
            )
        `);

        // Ensure existing deployments also get the new accountId column.
        await client.query(`
            ALTER TABLE bankAccounts
            ADD COLUMN IF NOT EXISTS accountId BIGINT
        `);

        await client.query(`DROP INDEX IF EXISTS idx_bankaccounts_accountid`);

        await client.query(`
            CREATE UNIQUE INDEX idx_bankaccounts_accountid
            ON bankAccounts (accountId)
            WHERE accountId IS NOT NULL
        `);

        console.log('Postgres schema ready');
    } catch (err) {
        console.error('Error initializing PostgreSQL database:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

// Register a new user
async function registerUser(user) {
    try {
        const res = await pool.query(
            `INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING *`,
            [user.name, user.username, user.password]
        );
        return res.rows[0];
    } catch (error) {
        console.error('Insert init error:', error);
        throw error;
    }
}

// Get user by username
async function getUser(username) {
    try {
        const res = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        return res.rows[0] || null;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
}

// Get user by id
async function getUserById(id) {
    try {
        const res = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error('Get user by id error:', error);
        throw error;
    }
}

// Create a bank account for a user
async function makeAccount({ Aname, balance, userId }) {
    try {
        const res = await pool.query(
            `INSERT INTO bankAccounts (Aname, balance, userId) VALUES ($1, $2, $3) RETURNING *`,
            [Aname, balance, userId]
        );
        return res.rows[0];
    } catch (error) {
        console.error('Create account error:', error);
        throw error;
    }
}

// Get user accounts
async function getUserAccounts(userId) {
    try {
        const res = await pool.query(
            `SELECT Aname, balance FROM bankAccounts WHERE userId = $1`,
            [userId]
        );
        return res.rows;
    } catch (error) {
        console.error('Error fetching user accounts:', error);
        return [];
    }
}

// Transfer money between accounts (transactional)
async function withdrawMoney({ yourAccount, accountName, amount }) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const withdrawRes = await client.query(
            `UPDATE bankAccounts SET balance = balance - $1 WHERE Aname = $2 AND balance >= $1 RETURNING id`,
            [amount, yourAccount]
        );

        if (withdrawRes.rowCount === 0) {
            throw new Error('Insufficient funds or account not found');
        }

        const depositRes = await client.query(
            `UPDATE bankAccounts SET balance = balance + $1 WHERE Aname = $2 RETURNING id`,
            [amount, accountName]
        );

        if (depositRes.rowCount === 0) {
            throw new Error('Destination account not found');
        }

        await client.query('COMMIT');
        console.log('Transfer successful!');
        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transfer failed:', error);
        throw error;
    } finally {
        client.release();
    }
}


function generateAccountId() {
  return crypto.randomInt(1_000_000_000, 10_000_000_000);
}


// Initialize immediately
initDB();

module.exports = { pool, initDB, registerUser, getUser, getUserById, makeAccount, getUserAccounts, withdrawMoney };

