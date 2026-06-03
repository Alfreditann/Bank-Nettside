const express = require('express');
const { updatecred } = require('../pgdb');

const router = express.Router();


router.get('/', (req, res) => {
	res.render('credentials.ejs', {
		saved: false,
		typedUsername: ''
	});
});

router.post('/', async (req, res) => {
	const { username, newusername } = req.body || {};
	await updatecred({ username, newusername });
	return res.render('credentials.ejs', {
		saved: true,
		typedUsername: newusername || ''
	});
});


module.exports = router;