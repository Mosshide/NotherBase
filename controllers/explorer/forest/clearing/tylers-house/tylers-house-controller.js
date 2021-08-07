const router = require("express").Router();

const houseDB = require("./models.js").house;

router.get("/", function(req, res) {
    res.render(`${__dirname}/views/index`, 
    {
        siteTitle: "NotherBase",
        user: null
    });
});

router.get("/livingroom", function(req, res) {
    res.render(`${__dirname}/views/livingroom`, 
    {
        siteTitle: "NotherBase",
        user: null
    });
});

module.exports = router;