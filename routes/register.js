const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.render('register.ejs', { error: req.query.error || null });

})

router.post("/", async (req, res) => {
    try {
        const { username } = req.body

        const existingUser = await getUser(username)

        // hasher passordet inkommende forespørsel fra register og bruker bcrypt algoritmen. passordet blir hashet 10 ganger
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = {
            id: Date.now().toString(),
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        }
        if (existingUser) {
            console.log("heipådei")
            return res.render('register.ejs', { error: "username is alredy in use" }) //hvis den ikke finner brukeren så skal den sende error
        }
        await registerUser(user)
        res.redirect("/login")

    }

    catch {
        res.redirect("/register")
    }
})
module.exports = router;