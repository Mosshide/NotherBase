const router = require("express").Router();

router.get("/", function(req, res) {
    res.render(`${__dirname}/views/index`, 
    {
        siteTitle: "NotherBase",
        user: req.session.currentUserFull
    });
});

router.get("/dock", function(req, res) {
    res.render(`${__dirname}/views/dock`, 
    {
        siteTitle: "NotherBase",
        user: req.session.currentUserFull
    });
});

router.get("/swim", function(req, res) {
    res.render(`${__dirname}/views/swim`, 
    {
        siteTitle: "NotherBase",
        user: req.session.currentUserFull,
        pov: req.query.pov
    });
});

router.get("/debris", function(req, res) {
    res.render(`${__dirname}/views/debris`, 
    {
        siteTitle: "NotherBase",
        user: req.session.currentUserFull,
    });
});


module.exports = router;