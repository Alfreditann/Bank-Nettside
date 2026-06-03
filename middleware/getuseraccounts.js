const { pool } = require('../pgdb');

async function getUserAccounts(userId) {
    const res = await pool.query(
        `SELECT id, account_name, balance
         FROM bank_accounts
         WHERE user_id = $1`,
        [userId]
    );
    return res.rows;
}

module.exports = { getUserAccounts };
