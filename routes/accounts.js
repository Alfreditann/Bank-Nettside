const express = require('express')
const { checkCurrentUser } = require('../middleware/authMiddleWare')
const {getUserAccounts} = require("../pgdb")
const router = express.Router()


router.get('/', checkCurrentUser, async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.render('accounts.ejs', {
            message: 'You must be logged in',
            accounts: [],
        });
    }

    const accounts = await getUserAccounts(userId);

    const message = accounts.length
        ? 'Here are your active accounts'
        : 'No current bank accounts';

    

    res.render('accounts.ejs', { message, accounts});
});
module.exports = router;