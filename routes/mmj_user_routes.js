const express = require("express");
const {createNewMmjUser, unsubscribeUser} = require("../controllers/mmjUsersController");
const router = express.Router();

router.post("/subscribe",createNewMmjUser);
router.post("/unsubscribe",unsubscribeUser);
module.exports = router;