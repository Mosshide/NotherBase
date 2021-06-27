const mongoose = require("mongoose");

const redBlueSchema = new mongoose.Schema({
	name: String,
	url: String
});

module.exports = mongoose.model("red-or-blue", redBlueSchema);