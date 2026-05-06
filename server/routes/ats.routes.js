const express = require("express");
const router = express.Router();

const { getATSReport, getReportsByUser } = require("../controllers/ats.controller");
const auth = require("../middleware/auth");
router.get("/user", auth, getReportsByUser);
router.get("/:id", auth, getATSReport);


module.exports = router;