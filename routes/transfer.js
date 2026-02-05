const express = require("express");
const router = express.Router();
const { withdrawMoney } = require("../database")

router.get("/", (req, res) => {
    res.render("transfer.ejs");
});

router.post("/", async (req, res) => {
    const { yourAccount, accountName, amount } = req.body;

    try {
        await withdrawMoney({
            yourAccount: yourAccount,
            accountName: accountName,
            amount: Number(amount)
        });

        res.redirect("/accounts?success=1");
    } catch (err) {
        res.redirect("/transfer?error=1");
    }
});

module.exports = router;
