const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Setup for Express
const app = express();
app.set("view engine", "ejs");
// allows us to delete
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
// allows us to use post body data
app.use(express.urlencoded({ extended: false }));
// allows us to get static files like css
app.use(express.static('public'));


// set up session
app.use(session({
    store: MongoStore.create({
        mongourl: "mongodb://localhost:27017/nother_base"
    }),
    secret: "nothr",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 //two weeks
    }
}));


// Import my Controller
const controllers = require("./controllers")

app.get("/", function(req, res) {
    res.render("./index.ejs");
});

app.use("/", controllers.auth)

app.use("/chat", controllers.chat);

app.use("/projects", controllers.projects);



// Go Off (On)
app.listen(4337);