const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    name: String,
	email: String,
    password: String
}, { timestamps: true });

//convert schema to model
const auth = mongoose.model('auth', authSchema);

module.exports = auth;