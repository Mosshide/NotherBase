const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Import my Data
const Auth = require("../models").auth;

router.get("/new-user", function(req, res) {
    res.render("auth/new")
});

router.get("/:id", function(req, res) {
    res.render("auth/index");
});

router.post("/", async function(req, res) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        let qAuth = await Auth.create({
            name: req.body.name,
            email: req.body.text,
            password: hash
        });
    
        res.render("index");
    }
    catch(err) {
        console.log(err);
    }
});



module.exports = router;