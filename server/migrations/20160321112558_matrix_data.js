
exports.up = function(knex, Promise) {
    return knex.schema.createTable('matrix_data', function(table) {
	    table.increments().primary();
	  	table.string("start_station");
	  	table.string("end_station");
	  	table.string("trip_start_hour");
	  	table.string("count");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('matrix_data');
};
