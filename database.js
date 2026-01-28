const mysql = require("mysql2")
const dotenv = require("dotenv")
dotenv.config() 
const mariadb = require("mariadb")


const DB_NAME = "bank"

const pool = mysql.createPool({
    host: "localhost",
    user: "bank_user",
    password: "userpassord",
    port: 3306
}).promise()

const pool2 = mysql.createPool({
    host: "localhost",
    user: "bank_user",
    password: "userpassord",
    db: "bank",
    port: 3306
}).promise()

console.log(1)

async function initDB() {
    let conn
    try {
        
        conn = await pool.getConnection()
        console.log("connection made")

        //conn = await pool2.getConnection()
        //console.log("conn2")

        await conn.query("CREATE DATABASE IF NOT EXISTS bank")
        console.log(`Database bank is ready`)

        await conn.query("USE bank")
        console.log("bank use")




    }
    catch(error) {
        console.error('Database init error:', error)
        process.exit(1)

    }
    finally{
       
    }
    try{
        //conn = await pool2.getConnection()
        //console.log("conn2")
        
        await conn.query(`CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL)`  
        )
        console.log("table created")
    }
    catch(error) {
        console.error('Table- init error:', error)
        process.exit(1)
    }
}
//initDB()
module.exports = {pool, initDB, DB_NAME}
 