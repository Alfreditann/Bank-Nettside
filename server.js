// Henter ut funksjoner fra database.js
const { initDB, registerUser, getUser, getUserById } = require("./database")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET // sier at den skal hente jwt fra .env
const path = require("path");

const loginRoute = require(`./routes/login`)
const dashboardRoute = require(`./routes/dahsboard`)
const registerRoute = require(`./routes/register`)

app.use(`/login`, loginRoute)
app.use(`/dashboard`, dashboardRoute)
app.use(`/register`, registerRoute)

initDB()



app.use(express.static(path.join(__dirname, "public")));



const { name } = require("ejs")//initializePassport gjør sånn at passord og bruker navn skal bli hentet ut fra getUser/getUserById funksjonen

app.set("view-engine", "ejs")
// Express.urlencoded er en metode i express som bruker til å recognize innkomende objecter som strings eller arrays
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    //req query er verdier som kommer i url-en express parser dette automatisk. disse i req.query js objektet
    res.render("index.ejs", { name: req.query.name })
})
async function startServer() {
    await initDB()
}

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000"

    )
})