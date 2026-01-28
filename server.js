if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initializePassport = require("./passport-config")
const { name } = require("ejs")
initializePassport(passport, username => users.find(user => user.username === username),  
id => users.find(user => user.id === id))

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
    console.log(users),
    console.log(users[0].id),
    res.render("index.ejs", { name: users[0].name})
])

app.get("/login", (req, res) => {
    res.render("login.ejs")
    
})

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
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        })
        res.redirect("/login")
       
    }
    
    catch {
        res.redirect("/register")
    }
     console.log(users)
})

app.listen(3000)