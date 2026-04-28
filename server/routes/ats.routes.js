const express = require("express");
const router = express.Router();

const { getATSReport } = require("../controllers/ats.controller");
const auth = require("../middleware/auth");

router.get("/:id", auth, getATSReport);

module.exports = router;