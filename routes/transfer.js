const express = require('express')
const router = express.Router()


router.post("/", (res,req)=>{
    res.render("transfer.ejs")
})

module.exports = router;