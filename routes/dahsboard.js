const express = require("express")
const app = express()
const { makeAccount } = require("../database");
const { checkCurrentUser } = require("../middleware/authMiddleWare");
const router = express.Router()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


router.get("/", (req, res) => {
    res.render("dashboard.ejs")
})

router.post("/", checkCurrentUser, async (req, res, next) => {
   

    try{
        let bAccount = {
            Aname: req.body.Aname,
            balance: req.body.balance,
            userId: req.user.id
        }
        await makeAccount(bAccount)
        res.redirect("/accounts")
    }
    catch(error){
        console.log(error)
        res.redirect("/dashboard")
    }

})

module.exports = router;