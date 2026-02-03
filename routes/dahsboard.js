const express = require("express")
const app = express()
const { makeAccount} = require("../database")
const router = express.Router()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.render("dashboard.ejs")
})

router.post("/",  async (req,res) =>{
    try {
           let bAccount = {
            Aname: req.body.Aname,
            userId: req.user.id,      
            balance: req.body.balance
        }
        await makeAccount(bAccount)
        res.redirect("/dashboard")
    }
    catch(error){
        console.error('Insert init error:', error)
    }
    
})

module.exports = router;