require("dotenv").config();

// Setup for Express
const express = require("express");
const app = express();
app.set("view engine", "ejs");

// allows us to delete
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//auth
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authCheck = require('./controllers/authCheck.js');

// allows us to use post body data
app.use(express.urlencoded({ extended: false }));

// allows us to get static files like css
app.use(express.static('public'));


// Import my Controller
const controllers = require("./controllers");

//enable cookies
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: process.env.SECRET || "won",
    resave: false,
    saveUninitialized: false
}));

app.use("/user", controllers.user);

app.use("/chat", controllers.chat);

app.use("/", authCheck, controllers.explorer);

// notherbase.com/:region/:subregion/:point-of-interest/:section-of-poi
// notherbase.com/forest/eye-of-the-forest/square/clothing-stall

// Go Off (On)
app.listen(process.env.PORT);