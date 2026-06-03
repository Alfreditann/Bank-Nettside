const express = require("express");
const app = express();
const { makeAccount } = require("../pgdb");
const { checkCurrentUser } = require("../middleware/authMiddleWare");
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.render("dashboard.ejs");
});

router.post("/", checkCurrentUser, async (req, res, next) => {
  try {
    const accountName = req.body.accountName || req.body.Aname;
    let bAccount = {
    accountName,
    balance: req.body.balance,
    userId: req.user?.id
}
    if (!bAccount.userId) {
      return res.redirect('/login');
    }
    await makeAccount(bAccount);
    console.log(accountName, req.body.balance, bAccount.userId);
    res.redirect("/accounts");
  } catch (error) {
    console.log(error);
    res.redirect("/dashboard");
  }
});

module.exports = router;
