const mongoose = require("mongoose");

//get schema template
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    name: String,
	text: String,
    date: Number
}, { timestamps: true });

//convert schema to model
const project = mongoose.model('chat', chatSchema);

module.exports = project;