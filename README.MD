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

### 1. Opprett databasen i PostgreSQL
Hvis du ikke allerede har en database, kan du lage en ny bruker og database i `psql`:

```sql
CREATE USER alfred WITH PASSWORD 'Skole123';
CREATE DATABASE bank OWNER alfred;
GRANT ALL PRIVILEGES ON DATABASE bank TO alfred;
```

Hvis du allerede har brukeren og databasen, kan du hoppe over dette steget.

### 2. Konfigurer `.env`
Bruk .env.example som referanse på hvordan .env din MÅ se ut.

### 3. Start PostgreSQL og appen
Når databasen er klar, start prosjektet:

```bash
npm install
npm run dev
```

### 4. Første oppstart
Når serveren starter, kjører `pgdb.js` automatisk `initDB()` og lager tabellene `users` og `bankAccounts` hvis de ikke finnes.

