const { authenticate } = require("passport")
const bcrypt = require("bcrypt")

const LocalStrategy = require("passport-local").Strategy

function initialize(passport, getUserByUsername){
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username)
        if (user == null) {
            return done(null, false, {message: "No user with that username"})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else {
                return done(null, false, {message: "Passoword incorrect"})
            }
        }
        catch(error){
            return done(error)
        }
    }
    passport.use(new LocalStrategy({usernameField: "username"}), authenticateUser)
    passport.serializeUser((user, done) =>[])
    passport.serializeUser((id, done) =>[])
}

module.exports = initialize