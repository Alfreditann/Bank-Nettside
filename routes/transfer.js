const express = require("express");
const router = express.Router();
const { transferMoney } = require("../pgdb");

router.get("/", (req, res) => {
    res.render("transfer.ejs");
});

router.post("/", async (req, res) => {
    const { yourAccount, accountId, amount } = req.body;
    const fromAccountId = Number(yourAccount);
    const toAccountId = Number(accountId);
    const transferAmount = Number(amount);

    try {
        if (!Number.isInteger(fromAccountId) || !Number.isInteger(toAccountId) || !Number.isFinite(transferAmount) || transferAmount <= 0) {
            return res.redirect("/transfer?error=1");
        }

        await transferMoney({
            fromAccount: fromAccountId,
            toAccount: toAccountId,
            amount: transferAmount
        });

        res.redirect("/accounts?success=1");
    } catch (err) {
        res.redirect("/transfer?error=1");
    }
});

module.exports = router;
