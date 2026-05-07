const { initDB, registerUser, getUser, getUserById } = require("../pgdb")
const express = require("express")
const path = require("path")
const bcrypt = require("bcrypt")
const router = express.Router()
const jwt = require("jsonwebtoken")

router.get("/", (req, res) => {
    res.render('login.ejs', { error: req.query.error || null });

})
router.get("/register", (req, res) => {

})
router.post('/', async (req, res) => {
    console.log(req.body)
    const {username, password} = req.body
    
    const user = await getUser(username) //venter på at den får brukernavn fra databasen
    console.log(username)
    if (!username) {
        return res.render('login.ejs', { error: "User does not exist" }) //hvis den ikke finner brukeren så skal den sende error
    }
    console.log("user", user)

    const match = await bcrypt.compare(password, user.password) //skjekker om passordet som ble skrevet inn matcher passordet i databasen
    if (!match) return res.render(`login.ejs`, { error: "password is wrong" }) // hvis det ikke matcher så skal den returnere en feil melding

    const payload = { // definerer hva det er som skal bli signert av jwt
        id: user.id,
        name: user.name,
        username: user.username
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }) //definerer token så jeg kan se den i webbrowser
    res.setHeader('Set-Cookie', `token=${token}; Max-Age=3600`);
    //res.cookie("token", token, { maxAge: 1000 * 3600 }) // lagrer token i cokkies og så skal den expire etter en time
    res.render("dashboard.ejs", { name: user.username });

})

module.exports = router;