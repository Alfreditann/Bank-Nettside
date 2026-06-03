const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
	res.render('credentials.ejs');
});

router.post('/', (req, res) => {
	const { username, password, confirmPassword } = req.body || {};
    console.log(username,password,confirmPassword)
	return res.redirect('/credentials');
});


module.exports = router;