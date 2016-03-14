var express = require('express'),
	app = express(),
	knex = require('./db/knex'),
	morgan = require('morgan');

require('locus');
require('dotenv').load();
app.use(morgan('tiny'));




var data = require('./routes');
app.use('/data', data);

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/server/index.html');
});



app.listen(process.env.PORT, function() {
    console.log('listening on 5000...');
});

module.exports = app;
