const express = require("express");
const router = express.Router();

const { analyzeFullFlow } = require("../controllers/analyze.controller");
const upload = require("../middleware/upload"); // multer
const auth = require("../middleware/auth"); // your auth middleware

router.post("/", auth, upload.single("resume"), analyzeFullFlow);

module.exports = router;