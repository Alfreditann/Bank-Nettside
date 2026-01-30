const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.render('login.ejs', { error: req.query.error || null });

})

router.post('/', async (req, res) => {
    const { username, password } = req.body //henter brukernavn og passord fra req.body

    const user = await getUser(username) //venter på at den får brukernavn fra databasen
    if (!user) {
        return res.render('login.ejs', { error: "User does not exsist" }) //hvis den ikke finner brukeren så skal den sende error
    }
    console.log("user", user)

    const match = await bcrypt.compare(password, user.password) //skjekker om passordet som ble skrevet inn matcher passordet i databasen
    if (!match) return res.render(`login.ejs`, { error: "password is wrong" }) // hvis det ikke matcher så skal den returnere en feil melding

    const payload = { // definerer hva det er som skal bli signert av jwt
        id: user.id,
        name: user.name,
        username: user.username
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }) //definerer token så jeg kan se den i webbrowser

    res.cookie("token", token, { maxAge: 1000 * 3600, sameSite: "strict" }) // lagrer token i cokkies og så skal den expire etter en time
    res.render("dashboard.ejs", { name: username });

})

module.exports = router;