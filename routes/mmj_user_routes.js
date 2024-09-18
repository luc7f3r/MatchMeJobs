const express = require("express");
const {createNewMmjUser} = require("../controllers/mmjUsersController");
const router = express.Router();

router.post("/subscribe",createNewMmjUser);

module.exports = router;