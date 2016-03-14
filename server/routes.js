var express = require('express'),
	router = express.Router(),
	request = require('request');


router.get('/', function (req, res) {
	res.send('hi');
});


module.exports = router;