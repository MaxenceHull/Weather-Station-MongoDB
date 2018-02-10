var mongoose = require('mongoose');

var measurement_schema = new mongoose.Schema({
	room: String,
	temperature: Number,
	brightness: Number,
	date: Date,
}, {collection: 'measurements'});

module.exports = mongoose.model('measurement', measurement_schema);
