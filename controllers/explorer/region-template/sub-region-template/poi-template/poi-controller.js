// This allows us to use routers
const router = require("express").Router();

// This runs our server-side scripts
const example = require("./server-scripts/example");

// This runs our server-side scripts
const exampleDB = require("./models").example;
const placeholderDB = require("./models").placeholder;

// This is where all the routes for sub-pois go
router.get("/", function(req, res) {
    res.render(`${__dirname}/views/index`, 
    {
        siteTitle: "NotherBase",
        user: null
    });
});

// This exports the router
module.exports = router;