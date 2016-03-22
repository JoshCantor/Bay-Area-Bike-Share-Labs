var express = require('express'),
	router = express.Router(),
	request = require('request'),
	knex = require('./db/knex');


router.get('/chords', function (req, res) {
	knex('matrix_data').orderBy('start_station')
	.then(function(data){
		res.send(data);
	}).catch(function(err){
		console.log(err);
	});
});

router.get('/stations', function (req, res) {
	knex('station_data')
		.where('station_id','>', 38)
		.whereNotIn('station_id', [80, 83, 84])
		.orderBy('name')
		.then(function(data){
			res.send(data);
		}).catch(function(err){
			console.log(err);
		});
});


module.exports = router;



//grab list of all start stations --> create the matrix base on this