const express = require("express");
const {getJobs} = require("../controllers/jobController");

const router = express.Router();

router.post("/",getJobs);

module.exports = router;