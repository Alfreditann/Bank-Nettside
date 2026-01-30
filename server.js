// Henter ut funksjoner fra database.js
const {initDB, registerUser, getUser, getUserById} = require("./database")

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
initDB()

app.use(express.static(path.join(__dirname, "public")));



const { name } = require("ejs")
//initializePassport gjør sånn at passord og bruker navn skal bli hentet ut fra getUser/getUserById funksjonen



app.set("view-engine", "ejs")
// Express.urlencoded er en metode i express som bruker til å recognize innkomende objecter som strings eller arrays
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())




app.get("/", (req, res) => [
    //req query er verdier som kommer i url-en express parser dette automatisk. disse i req.query js objektet
    res.render("index.ejs", { name: req.query.name})
])

app.get('/login', (req, res) => {
  res.render('login.ejs', { error: req.query.error || null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body //henter brukernavn og passord fra req.body

  const user = await getUser(username) //venter på at den får brukernavn fra databasen
  if (!user) return res.redirect('/login?error=User%20does%20not%20exsist'); //hvis den ikke finner brukeren så skal den sende error

  const match = await bcrypt.compare(password, user.password) //skjekker om passordet som ble skrevet inn matcher passordet i databasen
  if (!match) return res.redirect('/login?error=Wrong%20password'); // hvis det ikke matcher så skal den returnere en feil melding

  const payload = { // definerer hva det er som skal bli signert av jwt
    id: user.id,
    name: user.name,
    username: user.username
  }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }) //definerer token så jeg kan se den i webbrowser

  res.cookie("token", token, {maxAge: 1000 * 3600, sameSite: "strict"}) // lagrer token i cokkies og så skal den expire etter en time
   res.render("dashboard.ejs", { name: username });
  
})

app.get("/dashboard", (req,res)=> {
    res.render("dashboard.ejs")
})


app.get("/register", (req, res) => [
    res.render("register.ejs")
])

app.post("/register", async (req, res) => {
    try {
        // hasher passordet inkommende forespørsel fra register og bruker bcrypt algoritmen. passordet blir hashet 10 ganger
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = {
            id: Date.now().toString(),
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        }
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