const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
	res.render('credentials.ejs', {
		saved: false,
		typedUsername: ''
	});
});

router.post('/', (req, res) => {
	const { username, password, newusername } = req.body || {};
	console.log(username, newusername, password)
	return res.render('credentials.ejs', {
		saved: true,
		typedUsername: username || ''
	});
});


module.exports = router;