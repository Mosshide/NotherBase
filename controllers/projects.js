const express = require("express");
const router = express.Router();

// Import my Data
const Projects = require("../models/").projects;

// GET Routes
router.get("/", async function(req, res) {
    Projects.find({},  function(err, p) {
        const context = { style: "main", projects: p };
        res.render("projects/index", context);
    });
});
router.get("/new", function(req, res) {
    res.render("projects/new", { style: "main" });
});
router.get("/:id", function(req, res) {
    Projects.findById(req.params.id,  function(err, p) {
        const context = { style: "main", project: p };
        res.render("projects/show", context);
    });
});
router.get("/:id/edit", function(req, res) {
    Projects.findById(req.params.id, function(err, p) {
        const context = { style: "main", project: p };
        res.render("projects/edit", context);
    });
});

// POST Routes
router.post("/", function(req, res) {
    Projects.create({
        name: req.body.name, 
        url: req.body.url
    })
    res.redirect("/projects");
});

// PUT Routes
router.put("/:id", function(req, res) {
    Projects.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { url: req.body.url },
        function(err, updatedProject) {
            res.redirect(`/${req.params.id}`);
        }
    );
});

// DELETE Routes
router.delete("/:id", function(req, res) {
    Projects.findByIdAndDelete(
        req.params.id,
        (err, deletedArticle)=>{
            res.render("projects/delete", { style: "main" });
        }
    );
});

module.exports = router;