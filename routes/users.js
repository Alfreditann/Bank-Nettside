const express = require("express")
const router = express.Router()



router
    .route("/user/:id")
    .get((req, res) =>{
        console.log(req.user)
        res.send(`Get User With ID ${req.params.id}`)
    })
        .put((req, res) =>{
        res.send(`Update User With ID ${req.params.id}`)
    })
        .delete((req, res) =>{
        res.send(`Delete User With ID ${req.params.id}`)
    })

    users = {"Alfred": {password: "123"}}



router.get("/new", (req, res) => {
    res.render("users/new")
})

router.post("/", (req, res) =>{ 
    const isValid = true
    if (isValid) {
        users[req.body.firstName] = {password: "12345"}
        res.redirect(`/users/`)
    }
    else {
        console.log("Error")
        res.render("user/new", {firstName: req.body.firstName})
    }

})
router.get("/", (req,res)=>{
    const name = users[req.body.id]
    console.log(users)
    res.send(`welcome ${name}`)
})

router.param("id", (req, res, next, id) => {
    req.user = users[id]
    next()
})
module.exports = router