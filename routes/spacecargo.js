const express = require("express");

const router = express.Router();
const verifySecretToken = require("../middleware/verifySecretToken");
const spacecargoControllers = require("../controllers/spacecargoControllers");

router.use(verifySecretToken);

/* GET home page. */
router.route("/").post(spacecargoControllers.createScrapingProcess);

module.exports = router;
