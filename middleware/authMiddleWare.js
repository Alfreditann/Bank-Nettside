const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const user = require("user")



const checkCurrentUser = (req, res, next) => {

    const cookie = req.headers.cookie;
    if (!cookie) {
        res.locals.currentUser = null;
        next();
    }
    const token = cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    if (!token) {
        res.locals.currentUser = null;
        return next();
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        res.locals.currentUser = req.user;
        next();
    } catch (err) {
        console.error(err.message);
        res.locals.currentUser = null;
        next();
    }
};
module.exports = { checkCurrentUser }