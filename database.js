//mysql2  er ett klient biblotek for node.js designet til å koble til, spørre og interacte med mysql og mariadb databaser(mitt tilfelle mariadb). mysql2 er en oppgradering av mysql.
//
const mysql = require("mysql2")
const dotenv = require("dotenv")
dotenv.config() 
const mariadb = require("mariadb")


const DB_NAME = "bank"

// create pool brukers for kommandor jeg kan gjenbruke så disse blir brukt for innlogging til databsen
// så når getcConnection(linje 25) blir brukt så vet databasen hvilken bruker som blir logget inn og bruker verdiene i pool til det.
const pool = mysql.createPool({
    host: "localhost",
    user: "bank_user",
    password: "userpassord",
    port: 3306
    //.promise() er sånn at dette ojectet skal klare å gjøre noe eller ikke klare det.
}).promise()
// conn startet som en tom variabel som skal endres på
 let conn

console.log(1)
//denne funksjonen starter databasen og hvis den ikke finnes så lager det en ny en men hvis den finnes så bruker det bank databasen
// den vil også gjøre det samme for table så hvis table ikke finnes så vil den lage en, 
// men det vil ikke "bruke " tablen på samme måte så vi har den der for å kunne ha tilgang til den for å eventuelt legge til informasjon
async function initDB() {
   //try og catch er ganske likt som if og else. så hvis den ikke klarer det den prøver på så går den til catch for min catch returner ett error
    try {
        // her så bruker den getConnection funsksjonen til å koble til mariadb. maria db trenger info om bruker innlogging og port og det har vi definert på pool så den bruker valuesa fra pool
        conn = await pool.getConnection()
        console.log("connection made")

        //her lages databasen hvis den ikke finnes
        await conn.query("CREATE DATABASE IF NOT EXISTS bank")
        console.log(`Database bank is ready`)
        //her så sier vi at vi skal bruke databasen
        await conn.query("USE bank")
        console.log("bank use")




    }
    // catch displayer ett error hvis den ikke klarer å gjennomføre try
    catch(error) {
        console.error('Database init error:', error)
        process.exit(1)

    }
    try{
        //her så lages tabelen inni bank databasen hvis table users ikke finnes
        await conn.query(`CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(255) NOT NULL)`  
        )
        console.log("table created")


    }
    catch(error) {
        console.error('Table- init error:', error)
        process.exit(1)
    }
    
}
// hele denne funksjonen bruker til å registrere brukere inn i databasen.
async function registerUser(user) {
    try{
      // query sier at dette skal skje i databasen. vi inserter values som brukeren har registrert så vi kan bruke det til inlogging.
        await conn.query(`INSERT INTO users (name, username, password) VALUES(
            "${user.name}",
            "${user.username}",
            "${user.password}"
            ); `)
    }
    catch(error){
        console.error('Insert init error:', error)
        process.exit(1)
    }
}
//get user blir brukt til å hente ut brukeren fra databasen.
async function getUser(username) {
    try{
        // her så sier vi at den skal skjekke om bruker navnet finnes
        let result = await conn.query(`SELECT * FROM users WHERE username = "${username}";`)
        // shift heter ut første elementet og fjerner det. 
        // her så har jeg to arrays så den henter den første fra begge
        let user = result.shift().shift()
        console.log("hei", result)
        //så returnerer den brukeren
        return user;
    }
    catch(error){
        console.error('Insert init error:', error)
        process.exit(1)
    }
}
// her så gjør den egentlig det samme som med brukernavn men bare med id
async function getUserById(id) {
    try{
      
        let result = await conn.query(`SELECT * FROM users WHERE id = "${id}";`)
        let user = result.shift().shift()
        console.log("hei", result)
        return user;
    }
    catch(error){
        console.error('Insert init error:', error)
        process.exit(1)
    }
}
//her så exporter jeg alle funksjonene som jeg vil bruke i andre script.
module.exports = {pool, initDB, DB_NAME, registerUser, getUser, getUserById}
 