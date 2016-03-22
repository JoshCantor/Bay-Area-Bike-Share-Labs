 var knex = require('../db/knex')

 	knex
		.select('start_station', 'end_station', 'trip_start_hour').count('start_station')
		.from('trip_data')
		.join('station_data', 'station_data.name', '=', 'trip_data.start_station')
		.where('station_id','>', 38)
		.whereNotIn('station_id', [80, 83, 84])
		.groupBy('start_station', 'end_station', 'trip_start_hour')
		.orderBy('trip_start_hour', 'asc')
	.then(function(data) {
		knex('matrix_data').del().then(function(){
		});

		var promises = [];
		var tenPromises = [];

		data.forEach(function(obj, i) {
			tenPromises.push(knex('matrix_data').insert(obj));
		
			if (tenPromises.length === 10) {
				promises.push(tenPromises);
				tenPromises = [];
			} 
		});

		promises.forEach(function(list, i) {
			Promise.all(list)
				.then(function(data){
					// console.log(data);
					//return data;
				}).catch(function(err){
					console.log('yes, i am an error');
					if(err) console.log(err);
				});
		})
	})
