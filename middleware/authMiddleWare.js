const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const { getUserAccounts } = require("./getuseraccounts");



const checkCurrentUser = async (req, res, next) => {

    const cookie = req.headers.cookie;
    if (!cookie) {
        req.user = null;
        res.locals.currentUser = null;
        res.locals.accounts = [];
        return next();
    }
    const token = cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
    if (!token) {
        req.user = null;
        res.locals.currentUser = null;
        res.locals.accounts = [];
        return next();
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        res.locals.currentUser = req.user;
        try {
            const accounts = await getUserAccounts(req.user.id);
            req.accounts = accounts;
            res.locals.accounts = accounts;
        } catch (err) {
            req.accounts = [];
            res.locals.accounts = [];
        }
        return next();
    } catch (err) {
        console.error(err.message);
        req.user = null;
        res.locals.currentUser = null;
        res.locals.accounts = [];
        return next();
    }
};
module.exports = { checkCurrentUser }