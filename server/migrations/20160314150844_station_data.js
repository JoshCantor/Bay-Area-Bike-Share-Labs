
exports.up = function(knex, Promise) {
  return knex.schema.createTable('station_data', function(table) {
  	table.increments().primary();
  	table.integer("station_id");
  	table.string("name");
  	table.string("lat");
  	table.string("long");
  	table.string("dock_count");
  	table.string("city");
  	table.string("date_installed");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('station_data');
};
