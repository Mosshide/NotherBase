const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Import my Data
const Auth = require("../models").auth;

router.get("/new-user", function(req, res) {
    res.render("auth/new")
});

router.post("/new-user", async function(req, res) {
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

router.get("/login", function(req, res) {
    res.render("auth/login")
});

router.post("/login", async function(req, res) {
    try {
        const foundAccount = await Auth.find({ email: req.body.email });

        if (foundAccount) {
            if (await bcrypt.compare(nonhash, hash)) {
                req.session.currentUser = {
                    _id: foundAccount._id
                };
            };
        }
        else {
            res.redirect("auth/login");
        }       
    }
    catch(err) {

    }
});

router.delete {
    await req.session.destroy()
}

router.get("/:id", function(req, res) {
    res.render("auth/index");
});

module.exports = router;