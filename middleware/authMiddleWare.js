const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const user = require("user")
const {cookie } = require("../routes/login")



const checkCurrentUser = (req, res, next) => {
   
 const token = req.headers.cookie.split('=')[1];
    if (!token) {
        res.locals.currentUser = null;
         next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        res.locals.currentUser = decodedToken;
        req.user = decodedToken;
        next();
    } catch (err) {
        console.error(err.message);
        res.locals.currentUser = null;
        next();
    }
};
module.exports = {checkCurrentUser}