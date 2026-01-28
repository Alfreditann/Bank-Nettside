// Henter ut funksjoner fra database.js
const {initDB, registerUser, getUser, getUserById} = require("./database")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

initDB()


const initializePassport = require("./passport-config")
const { name } = require("ejs")
initializePassport(passport, username => getUser(username),  
id => getUserById(id))

const users = []

app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session()) 

app.get("/", (req, res) => [
    //req query er verdier som kommer i url-en express parser dette automatisk disse i req.query js objektet
    res.render("index.ejs", { name: req.query.name})
])

app.get("/login", (req, res) => {
    res.render("login.ejs")
    
})

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/?name=' + req.user.name);
  });

app.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect:"login",
    failureFlash: true
}))


app.get("/register", (req, res) => [
    res.render("register.ejs")
])

app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = {
            id: Date.now().toString(),
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        }
        users.push(user)
        await registerUser(user)
        res.redirect("/login")
       
    }
    
    catch {
        res.redirect("/register")
    }
})



async function startServer() {
    await initDB()
}

app.listen(3000,() => {
    console.log("Server is running on http://localhost:3000"

    )
})