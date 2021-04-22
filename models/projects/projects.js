const mongoose = require("mongoose");

//get schema template
const Schema = mongoose.Schema;
const projectSchema = new Schema({
	name: String,
	url: String
}, { timestamps: true });

//convert schema to model
const project = mongoose.model('projects', projectSchema);

module.exports = project;