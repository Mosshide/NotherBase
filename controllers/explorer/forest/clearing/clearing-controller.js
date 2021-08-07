const router = require("express").Router();

router.use("/wyatts-house", require("./wyatts-house/wyatts-house-controller.js"));
router.use("/tylers-house", require("./tylers-house/tylers-house-controller.js"));

module.exports = router;