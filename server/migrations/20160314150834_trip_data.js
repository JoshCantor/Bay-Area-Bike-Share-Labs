
exports.up = function(knex, Promise) {
  return knex.schema.createTable('trip_data', function(table) {
  	table.increments().primary();
	table.string("trip_id");
	table.string("duration");
	table.string("start_date");
	table.string("start_station");
	table.string("start_terminal");
	table.string("end_date");
	table.string("end_station");
	table.string("end_terminal");
	table.string("bike_number");
	table.string("subscriber_type");
	table.string("subscriber_zipcode");
  });
};	

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('trip_data');
};
