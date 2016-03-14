
exports.up = function(knex, Promise) {
  return knex.schema.createTable('trip_data', function(table) {
  	table.increments().primary();
	table.integer("trip_id");
	table.integer("duration");
	table.string("start_date");
	table.string("start_station");
	table.string("start_terminal");
	table.string("end_date");
	table.string("end_station");
	table.string("end_terminal");
	table.integer("bike_number");
	table.integer("subscriber_type");
	table.integer("subscriber_zipcode");
  });
};	

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('trip_data');
};
