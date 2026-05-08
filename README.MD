# Bank nettside
En liten nettside for en bank med fungerene innlogginsystem og bank account system.
## Hva nettsiden gjør
* Registrere brukere
* logge inn
* Lagrer passord som hash (ikke i klartekst)
* lage bank accounts
* Overføre penger til andre accounts
## Tech stack
* Node.js and Express
* JWT
* Postgresql database
* Password hashing
* Ejs for "Frontend"
## Krav
* Node.js 18+
* npm
* postgresql
## miljøvariabler(.env)
Lag en .env i prosjekt ruten din(du kan kopiere fra .env.example)

Disse verdiene brukes: 
* DB_USER(brukernavnet til postgres brukeren din)
* DB_HOST(ip til database servern)
* DB_NAME 
* DB_PASSWORD
* DB_POST (porten som databasen kjører på)
* JWT_SECRET
## Komme i gang
### 1. Start database servern
 